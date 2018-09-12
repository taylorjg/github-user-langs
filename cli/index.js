const program = require('commander')
const github = require('../github')

const formatPercentageOptions = {
  minimumIntegerDigits: 2,
  minimumFractionDigits: 3,
  maximumFractionDigits: 3
}

const formatPercentage = percentage =>
  `${percentage.toLocaleString(undefined, formatPercentageOptions)}%`

const printLang = lang =>
  console.log(`${lang.name.padEnd(20, '.')}${formatPercentage(lang.percentage)}`)

const main = async (token, username) => {
  try {
    const results = await github.getUserLangs(token, username)
    results.forEach(printLang)
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
