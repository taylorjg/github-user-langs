const axios = require('axios')
const R = require('ramda')
const program = require('commander')

program
  .option('-t, --token <token>', 'GitHub API token')
  .parse(process.argv)

axios.defaults.baseURL = 'https://api.github.com/graphql'

if (program.token) {
  axios.defaults.headers.common['Authorization'] = `bearer ${program.token}`
}

const USERNAME = 'quezlatch'
const REPO = 'IsomorphicSafeFable'

// const getPages = async (query, makeNextQuery) => {
//   const response = await axios.post('', { query })
//   const data = response.data.data
//   const nextQuery = makeNextQuery(data)
//   if (nextQuery) {
//     return [data, ...await getPages(nextQuery, makeNextQuery)]
//   }
//   else {
//     return [data]
//   }
// }

const handleError = err => {
  if (err.response) {
    const response = err.response
    const request = response.request
    const status = response.status
    const statusText = response.statusText
    if (response.data && response.data.message) {
      console.log(`[${request.method} ${request.path}] status: ${status} statusText: ${statusText} message: ${response.data.message}`)
    }
    else {
      console.log(`[${request.method} ${request.path}] status: ${status} statusText: ${statusText} err: ${err}`)
    }
  }
  else {
    if (err.config) {
      console.log(`[${err.config.method} ${err.config.url}] err: ${err}`)
    }
    else {
      console.log(`err: ${err}`)
    }
  }
}

const asyncWrapper = async () => {
  try {
    // TODO: filter for source repos only ?
    const query = `
      {
        user(login: ${USERNAME}) {
          repositories(first: 100) {
            edges {
              node {
                id
                name,
                languages(first: 100) {
                  edges {
                    size
                  }
                  nodes {
                    name
                  }
                }
              }
            }
          }
        }
      }`

    const response = await axios.post('', { query })
    const repos = response.data.data.user.repositories.edges;
    repos.forEach(repo => {
      const repoName = repo.node.name
      const languageEdges = repo.node.languages.edges
      const languageNodes = repo.node.languages.nodes
      const languages = languageNodes.map((languageNode, index) => `${languageNode.name} (${languageEdges[index].size})`).join(', ')
      console.log(`${repoName}: ${languages}`)
    });

    // const initialQuery = makeRepoQuery()
    // const results = await getPages(initialQuery, data => {
    //   const edges = data.user.repositories.edges
    //   return edges.length ? makeRepoQuery(edges.slice(-1)[0].cursor) : null
    // })
    // const repositories = flatten(results.map(data => data.user.repositories.edges))
  }
  catch (err) {
    handleError(err)
  }
}

asyncWrapper()
