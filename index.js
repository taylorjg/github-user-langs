const axios = require('axios')
const R = require('ramda')
const program = require('commander')

axios.defaults.baseURL = 'https://api.github.com/graphql'

const getAllPagesOfQuery = async (token, query, makeNextQuery) => {
  const config = {
    headers: {
      authorization: `bearer ${token}`    
    }    
  }
  const response = await axios.post(null, { query }, config)
  const data = response.data.data
  const nextQuery = makeNextQuery(data)
  return nextQuery
    ? [data, ...await getAllPagesOfQuery(token, nextQuery, makeNextQuery)]
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

const main = async (token, username) => {
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

    const makePaginatedQuery = makeQuery(username)

    const extractRepoEdges = data =>
      data.user.repositories.edges

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

    const addPercentages = ({grandTotal, langs}) => R.map(lang => ({
      ...lang,
      percentage: lang.size * 100 / grandTotal
    }), langs)

    const compareLang = (lang1, lang2) =>
      lang2.percentage - lang1.percentage

    const printLang = lang =>
      console.log(`${lang.name.padEnd(20, '.')}${lang.percentage.toFixed(3)}%`)

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
      R.sort(compareLang),
      R.forEach(printLang)
    )
    
    const query = makePaginatedQuery()

    const queryResults = await getAllPagesOfQuery(token, query, data => {
      const edges = data.user.repositories.edges
      if (edges.length) {
        const lastCursor = edges.slice(-1)[0].cursor
        return makePaginatedQuery(lastCursor)
      }
    })

    pipe(queryResults)
  }
  catch (err) {
    handleError(err)
  }
}

program
  .arguments('<token> <username>')
  .action(main)
  .usage("token username")
  .parse(process.argv)

if (process.argv.length !== 4) {
  program.help();
}
