const fs = require('fs')
const router = require('express').Router()

fs
    .readdirSync(__dirname)
    .filter(name => name !== 'index.js')
    .forEach(name => { router.use(`/${name.split('.js').join('')}`, require(`./${name}`)) })

module.exports = router