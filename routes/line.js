const express = require('express')
const router = require('express').Router()
const linebot = require('linebot')
const Controllers = require('../controllers')
const Controllers2 = require('../controllers/controller')

// 鉅泰
const bot = linebot({
    channelId: '2006499890',
    channelSecret: 'e6b1723c95864e023cd4f00401a67dd5',
    channelAccessToken: '4T7B6pY+FQR9ZKZ3i51kl0UELdGNzqE/b3r8Axns5LZEO0XjZEcLDaSSZVmY2W8dhHroq5Y4ilbI562NiypQxymhKvumfGXyYnzCnoSQCpDzAwmZMJDFw6Q1uXNizbAOt+xfW9WBGPUuzb+VUSybDQdB04t89/1O/w1cDnyilFU=',
})


const linebotParser = bot.parser();
router.post('/linewebhook', linebotParser);
//JASON
// router.post('/', Controllers2.linebotParser);
// 處理使用者加入好友事件
bot.on('follow', Controllers.line.linejoin);
bot.on('unfollow', Controllers.line.lineUnjoin);


module.exports = router;
