const express = require('express')
const ngApimock = require('ng-apimock')()

const app = express()

ngApimock.run({
  "src": "mockserver/mocks",
  "outputDir": ".tmp/ngApimock",
})

const port = process.env.PORT || 3001

app.use(require('ng-apimock/lib/utils').ngApimockRequest)
app.use('/mocking', express.static('.tmp/ngApimock'))

app.listen(port, () => console.log(`Listening on port ${port}`))
