const axios = require('axios')
const R = require('ramda')

axios.defaults.baseURL = 'https://api.github.com/graphql'

const getAllPagesOfQuery = async (token, query, makeNextQuery) => {
  const config = {
    headers: {
      authorization: `bearer ${token}`
    }
  }
  const response = await axios.post(null, { query }, config)
  const data = response.data
  const nextQuery = makeNextQuery(data)
  return nextQuery
    ? [data, ...await getAllPagesOfQuery(token, nextQuery, makeNextQuery)]
    : [data]
}

const getUserLangs = async (token, username) => {

  const queryBuilder = username => cursor => {
    const after = cursor ? `, after: "${cursor}"` : ''
    return `{
      user(login: ${username}) {
        repositories(first: 100 ${after}) {
          edges {
            node {
              id
              name
              isFork
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

  const extractRepoEdges = response =>
    response.data.user.repositories.edges

  const nonForkedRepos = repo =>
    !repo.node.isFork

  const extractLangs = repo => {
    const edges = repo.node.languages.edges
    const nodes = repo.node.languages.nodes
    return R.zip(edges, nodes).map(([edge, node]) => ({
      size: edge.size,
      name: node.name,
      color: node.color
    }))
  }

  const langName = lang =>
    lang.name

  const reduceLangs = langs => ({
    ...langs[0],
    size: R.sum(R.pluck('size', langs))
  })

  const calculateGrandTotal = langs =>
    R.sum(R.pluck('size', langs))

  const withGrandTotal = langs => ({
    grandTotal: calculateGrandTotal(langs),
    langs
  })

  const addPercentages = ({ grandTotal, langs }) => R.map(lang => ({
    ...lang,
    percentage: lang.size * 100 / grandTotal
  }), langs)

  const compareLang = (lang1, lang2) =>
    lang2.percentage - lang1.percentage

  const pipe = R.pipe(
    R.map(extractRepoEdges),
    R.flatten,
    R.filter(nonForkedRepos),
    R.map(extractLangs),
    R.flatten,
    R.groupBy(langName),
    R.values,
    R.map(reduceLangs),
    withGrandTotal,
    addPercentages,
    R.sort(compareLang)
  )

  const query = paginatedQueryBuilder()

  const queryResults = await getAllPagesOfQuery(token, query, response => {
    const repos = R.pathOr([], ['data', 'user', 'repositories', 'edges'], response)
    if (repos.length) {
      const lastCursor = repos.slice(-1)[0].cursor
      return paginatedQueryBuilder(lastCursor)
    }
  })

  const errors = queryResults[0].errors

  return errors
    ? { failure: { errors } }
    : { success: pipe(queryResults) }
}

module.exports = {
  getUserLangs
}
