const sequelize = require('../models')
const axios = require('axios')
const fs = require('fs')
// const time = require('../time')
const Toolkit = { sequelize, axios }
const controllers = {}

fs
    .readdirSync(__dirname)
    .filter(name => name !== 'index.js')
    .forEach(name => {
        let route = name.replace('.js', '')
        controllers[route] = require(`./${name}`)(Toolkit)
    })

module.exports = controllers