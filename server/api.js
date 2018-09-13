const express = require('express')
const github = require('../github')

const buildRouter = token => {

  const userLangs = async (req, res) => {
    const username = req.params.username
    try {
      const results = await github.getUserLangs(token, username)
      res.json(results)
    }
    catch (error) {
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
