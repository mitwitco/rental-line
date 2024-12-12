const express = require('express')
const router = require('express').Router()
const linebot = require('linebot')
const Controllers = require('../controllers')
const { CronJob } = require('cron');
const nodemailer = require('nodemailer');

// 鉅泰
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: 'invoice@jutai.net',
    pass: 'qivrgwnfbtsgrcix',
  },
});
const bot = linebot({
    channelId: '2006499890',
    channelSecret: 'e6b1723c95864e023cd4f00401a67dd5',
    channelAccessToken: '4T7B6pY+FQR9ZKZ3i51kl0UELdGNzqE/b3r8Axns5LZEO0XjZEcLDaSSZVmY2W8dhHroq5Y4ilbI562NiypQxymhKvumfGXyYnzCnoSQCpDzAwmZMJDFw6Q1uXNizbAOt+xfW9WBGPUuzb+VUSybDQdB04t89/1O/w1cDnyilFU=',
})


const linebotParser = bot.parser();
router.post('/linewebhook', linebotParser);

bot.on('follow', Controllers.line.linejoin);
bot.on('unfollow', Controllers.line.lineUnjoin);
//JASON
bot.on('message',Controllers.line.linemessage );

const phoneCron = new CronJob('*/15 * * * *', async () => {
  await Controllers.line.phoneCron(); 
});
const lineCron = new CronJob('*/15 * * * *', async () => {
  await Controllers.line.linepushCron(bot); 
});
const mailCron = new CronJob('*/15 * * * *', async () => {
  await Controllers.line.mailCron(transporter); 
});
phoneCron.start();
lineCron.start();
mailCron.start();




  

module.exports = router;
