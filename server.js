const express = require('express')
const cors = require('cors')
const route = require('./routes')
const fs = require('fs')
const path = require('path')

const router = express.Router()
// app.use(express.json())
const app = express()
app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))

app.use('/', route)
app.use('/line',route)

const server = app.listen( process.env.PORT || 3602, () => {
    console.log(`Application works on port: ${server.address().port}`)
})
