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

// const USERNAME = 'quezlatch'
const USERNAME = 'taylorjg'
// const REPO = 'IsomorphicSafeFable'

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
    const query = `
      {
        user(login: ${USERNAME}) {
          repositories(first: 100) {
            edges {
              node {
                id,
                name,
                isFork
                languages(first: 100) {
                  edges {
                    size
                  }
                  nodes {
                    name,
                    color
                  }
                }
              }
            }
          }
        }
      }`

    const extractLanguages = repo => {
      const edges = repo.node.languages.edges
      const nodes = repo.node.languages.nodes
      return R.zip(edges, nodes).map(([edge, node]) => ({
        size: edge.size,
        name: node.name,
        color: node.color
      }))
    }

    const response = await axios.post('', { query })

    // raw query results
    const repos = response.data.data.user.repositories.edges

    // filter and reshape: [[{name, size, color}]]
    const v1 = repos
      .filter(repo => !repo.isFork)
      .map(extractLanguages)
    console.log(`repo count: ${v1.length}`)

    // flatten: [{name, size, color}]
    const v2 = R.flatten(v1)

    // group by: name => [{name, size, color}]
    const v3 = R.groupBy(x => x.name, v2)

    // reduce: name => {name, size, color}
    const v4 = R.map(langs => ({
      ...langs[0],
      size: R.sum(R.pluck('size', langs))
    }), v3)

    // [{name, size, color}]
    const v5 = R.values(v4)

    // { grandTotal: number, languages: [{name, size, color}] }
    const v6 = R.assoc(
      'grandTotal',
      R.sum(R.pluck('size', v5)),
      { languages: v5 }
    )

    // add percentages: [{name, size, color, percentage}]
    const v7 = R.map(lang => ({
      ...lang,
      percentage: lang.size * 100 / v6.grandTotal
    }), v6.languages)

    const printLanguage = lang =>
      console.log(`${lang.name.padEnd(20, '.')}${lang.percentage.toFixed(3)}%`)

    v7
      .filter(lang => lang.percentage >= 0.5)
      .forEach(printLanguage)
  }
  catch (err) {
    handleError(err)
  }
}

asyncWrapper()
