const path = require('path')
const express = require('express')
const api = require('./api')

const port = process.env.PORT || 3001
const token = process.env.TOKEN

const publicFolder = path.join(__dirname, 'public')

const app = express()
app.use('/', express.static(publicFolder))
app.use('/api', api.buildRouter(token))

app.listen(port, () => console.log(`Listening on port ${port}`))
