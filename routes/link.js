const router = require('express').Router()
const Controllers = require('../controllers')

router.post('/linkLine', Controllers.link.linkLine);   // 綁定


module.exports = router;
