const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})