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

const getAllPagesOfQuery = async (query, makeNextQuery) => {
  const response = await axios.post(null, { query })
  const data = response.data.data
  const nextQuery = makeNextQuery(data)
  return nextQuery
    ? [data, ...await getAllPagesOfQuery(nextQuery, makeNextQuery)]
    : [data]
}

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
    const makeQuery = username => cursor => {
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

    const makePaginatedQuery = makeQuery(USERNAME)

    const extractLanguages = repo => {
      const edges = repo.node.languages.edges
      const nodes = repo.node.languages.nodes
      return R.zip(edges, nodes).map(([edge, node]) => ({
        size: edge.size,
        name: node.name,
        color: node.color
      }))
    }

    const printLanguage = lang =>
      console.log(`${lang.name.padEnd(20, '.')}${lang.percentage.toFixed(3)}%`)

    const compareLang = (lang1, lang2) => lang2.percentage - lang1.percentage

    const query = makePaginatedQuery()

    const results = await getAllPagesOfQuery(query, data => {
      const edges = data.user.repositories.edges
      if (edges.length) {
        const lastCursor = edges.slice(-1)[0].cursor
        return makePaginatedQuery(lastCursor)
      }
    })

    const repos = R.flatten(results.map(data => data.user.repositories.edges))
    console.log(`Total repo count: ${repos.length}`)

    // filter and reshape: [[{name, size, color}]]
    const v1 = repos
      .filter(repo => !repo.node.isFork)
      .map(extractLanguages)
    console.log(`Filtered repo count: ${v1.length}`)

    // flatten: [{name, size, color}]
    const v2 = R.flatten(v1)

    // group by: name => [{name, size, color}]
    const v3 = R.groupBy(lang => lang.name, v2)

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

    v7
      .sort(compareLang)
      // .filter(lang => lang.percentage >= 0.5)
      .forEach(printLanguage)
  }
  catch (err) {
    handleError(err)
  }
}

asyncWrapper()
