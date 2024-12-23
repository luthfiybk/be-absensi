const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const routes = require('./src/routes/index.routes')
const cors = require('cors')
require('dotenv').config()
const session = require('express-session')
const liveReload = require('connect-livereload')
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 8080

const corsOptions = {
    origin: process.env.WEB_URL || 'http://localhost:3000',
    httpOnly: false
}

app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
        sameSite: 'strict',
    }
}))

app.use(liveReload())

app.use('/api', routes)
app.disable('etag')

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})