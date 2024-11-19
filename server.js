const express = require('express')
const cors = require('cors')
const route = require('./routes')
const fs = require('fs')
const path = require('path')

const router = express.Router()

const app = express()
app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))

app.use('/', route)
app.use('/line',route)

router.use(express.static('dist'))
router.get('*', (req, res) => { //變數
    const page = req.params.page
    if (page != 'favicon.ico') {

        const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')
        res.send(html)
    }
})
app.use(router)

const server = app.listen( 3348, () => {
    console.log(`Application works on port: ${server.address().port}`)
})
