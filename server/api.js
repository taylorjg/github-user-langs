const express = require('express')
const github = require('../github')
const R = require('ramda')
const common = require('../common')

const buildRouter = token => {

  const userLangs = async (req, res) => {
    const username = req.params.username
    try {
      const results = await github.getUserLangs(token, username)
      if (results.success) {
        const langs = common.filterResults(results)
        const langsLength = langs.length
        const langsList = R.pluck('name', langs).join(', ')
        console.log(`[${username}] INFO | #langs: ${langsLength}; langs: ${langsList}`)
      } else {
        console.log(`[${username}] ERROR | ${JSON.stringify(results)}`)
      }
      res.json(results)
    }
    catch (error) {
      console.log(`[${username}] ERROR | ${error.stack}`)
      res.status(500).send(error.message || 'Internal Server Error')
    }
  }
  
  const router = express.Router()
  router.get('/userLangs/:username', userLangs)
  
  return router
}

module.exports = {
  buildRouter
}
