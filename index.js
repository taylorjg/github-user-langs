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

    const extractRepoEdges = data => data.user.repositories.edges

    const nonForkedRepos = repo => !repo.node.isFork

    const extractLanguages = repo => {
      const edges = repo.node.languages.edges
      const nodes = repo.node.languages.nodes
      return R.zip(edges, nodes).map(([edge, node]) => ({
        size: edge.size,
        name: node.name,
        color: node.color
      }))
    }

    const langName = lang => lang.name

    const collapseLangs = langs => ({
      ...langs[0],
      size: R.sum(R.pluck('size', langs))
    })

    const calculateGrandTotal = languages =>
      R.sum(R.pluck('size', languages))

    const withGrandTotal = languages => ({
      grandTotal: calculateGrandTotal(languages),
      languages
    })

    const withPercentages = ({grandTotal, languages}) => R.map(lang => ({
      ...lang,
      percentage: lang.size * 100 / grandTotal
    }), languages)

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

    const pipe = R.pipe(
      R.map(extractRepoEdges),
      R.flatten,
      R.filter(nonForkedRepos),
      R.map(extractLanguages),
      R.flatten,
      R.groupBy(langName),
      R.map(collapseLangs),
      R.values,
      withGrandTotal,
      withPercentages,
      R.sort(compareLang),
      R.forEach(printLanguage)
    )
    
    pipe(results)
  }
  catch (err) {
    handleError(err)
  }
}

asyncWrapper()
