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
    // TODO: filter for source repos only ?
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
                    name
                  }
                }
              }
            }
          }
        }
      }`

    const extractRepoName = repo => repo.node.name

    const extractLanguages = repo => {
      const sizes = R.pluck('size', repo.node.languages.edges)
      const names = R.pluck('name', repo.node.languages.nodes)
      return R.zip(sizes, names).map(([size, name]) => ({ size, name }))
    }

    const response = await axios.post('', { query })
    const repos = response.data.data.user.repositories.edges
    const v1 = repos
      .filter(repo => !repo.isFork)
      .map(repo => ({
        repoName: extractRepoName(repo),
        languages: extractLanguages(repo)
      }))
    const v2 = v1.map(repo => ({
      repoName: repo.repoName,
      totalSize: R.sum(R.pluck('size', repo.languages)),
      languages: repo.languages
    }))
    const v3 = v2.reduce(
      (m1, repo) => repo.languages.reduce(
        (m2, lang) => {
          const currentSize = m2.get(lang.name) || 0
          return m2.set(lang.name, currentSize + lang.size)
        },
        m1
      ),
      new Map()
    )
    const totalSize = R.sum(v3.values())
    const v4 = new Map(Array.from(v3.entries()).map(([k, v]) => [k, (v * 100 / totalSize)]))
    const pairs = Array.from(v4.entries())
    pairs
      .filter(([, v]) => v >= 0.5)
      .forEach(([k, v]) => {
      console.log(`lang: ${k.padEnd(20, '.')}${v.toFixed(3)}%`)
    })
  }
  catch (err) {
    handleError(err)
  }
}

asyncWrapper()
