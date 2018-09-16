const axios = require('axios')
const R = require('ramda')

axios.defaults.baseURL = 'https://api.github.com/graphql'

const getAllPagesOfQuery = async (token, query, makeNextQuery) => {

  /*
   * TODO:
   * Add a module init function that takes `token` as a param
   * and adds a default axios `authorization` header.
   */
  const config = {
    headers: {
      authorization: `bearer ${token}`
    }
  }

  try {
    const response = await axios.post(null, { query }, config)
    const data = response.data
    const nextQuery = makeNextQuery(data)
    return nextQuery
      ? [data, ...await getAllPagesOfQuery(token, nextQuery, makeNextQuery)]
      : [data]
  } catch (error) {
    const response = error.response
    const baseMessage = 'An error occurred invoking the GitHub GraphQL API'
    const message =
      response && response.status && response.data && response.data.message
        ? `${baseMessage} (${response.status} ${response.data.message}).`
        : response && response.status && response.statusText
          ? `${baseMessage} (${response.status} ${response.statusText}).`
          : `${baseMessage}.`
    return [{ errors: [{ message }] }]
  }
}

const getUserLangs = async (token, username) => {

  const queryBuilder = username => cursor => {
    const after = cursor ? `, after: "${cursor}"` : ''
    return `{
      user(login: "${username}") {
        name
        email
        location
        avatarUrl
        websiteUrl
        repositories(first: 100 ${after}) {
          edges {
            node {
              id
              name
              isFork
              owner {
                login
              }
              languages(first: 100) {
                edges {
                  size
                }
                nodes {
                  name
                  color
                }
              }
            }
            cursor
          }
        }
      }
    }`
  }

  const paginatedQueryBuilder = queryBuilder(username)

  const isOwned = repo =>
    repo.node.owner.login.toLowerCase() === username.toLowerCase()

  const makeLangs = repo => {
    const edges = repo.node.languages.edges
    const nodes = repo.node.languages.nodes
    return R.zip(edges, nodes).map(([edge, node]) => ({
      size: edge.size,
      name: node.name,
      color: node.color,
      repoName: repo.node.name,
      repoIsFork: repo.node.isFork,
      repoIsOwned: isOwned(repo)
    }))
  }

  const extractUserAndRepos = results => ({
    user: R.dissoc('repositories', results[0].data.user),
    repos: R.chain(result => result.data.user.repositories.edges, results)
  })

  const extractLangsFromRepos = reshapedResults => ({
    ...reshapedResults,
    langs: R.chain(makeLangs, reshapedResults.repos)
  })

  const reshapeRepo = repo =>
    R.assoc(
      'isOwned',
      isOwned(repo),
      R.pick(['name', 'isFork'], repo.node))

  const reshapeRepos = reshapedResults => ({
    ...reshapedResults,
    repos: R.map(reshapeRepo, reshapedResults.repos)
  })

  const groupLangs = reshapedResults => ({
    ...reshapedResults,
    langGroups: R.values(R.groupBy(lang => lang.name, reshapedResults.langs))
  })

  const query = paginatedQueryBuilder()

  const queryResults = await getAllPagesOfQuery(token, query, response => {
    const repos = R.pathOr([], ['data', 'user', 'repositories', 'edges'], response)
    if (repos.length) {
      const lastCursor = repos.slice(-1)[0].cursor
      return paginatedQueryBuilder(lastCursor)
    }
  })

  const pipe = R.pipe(
    extractUserAndRepos, // { user, repos }
    extractLangsFromRepos, // { user, repos, langs }
    reshapeRepos, // { user, repos, langs }
    groupLangs, // { user, repos, langs, langGroups }
    R.dissoc('langs')
  )

  const errors = queryResults[0].errors

  return errors
    ? { failure: { errors } }
    : { success: pipe(queryResults) }
}

module.exports = {
  getUserLangs
}
