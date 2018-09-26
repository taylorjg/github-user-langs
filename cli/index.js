const program = require('commander')
const ghConfigure = require('../github')
const common = require('../common')

const printLang = lang =>
  console.log(`${lang.name.padEnd(20, '.')}${common.formatPercentage(lang.percentage)}`)

const main = async (token, username) => {
  try {
    const gh = ghConfigure(token)
    const results = await gh.getUserLangs(username)
    if (results.failure) {
      console.log(`ERROR: ${results.failure.errors[0].message}`)
    } else {
      console.log(`#repos: ${common.countRepos(results)}`)
      common.filterResults(results).forEach(printLang)
    }
  }
  catch (error) {
    console.log(`ERROR: ${error}`)
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
