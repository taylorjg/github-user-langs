const express = require('express')
const github = require('../github')

const buildRouter = token => {

  const userLangs = async (req, res) => {
    const username = req.params.username
    const results = await github.getUserLangs(token, username)
    res.json(results)
  }
  
  const router = express.Router()
  router.get('/userLangs/:username', userLangs)
  
  return router
}

module.exports = {
  buildRouter
}
