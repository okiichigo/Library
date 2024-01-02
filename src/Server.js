
const express = require('express')
require('dotenv').config()
const webRouter = require('./router/web')


const app = express()
const port = process.env.PORT
const hostname = process.env.HOST_NAME

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', webRouter)

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})
