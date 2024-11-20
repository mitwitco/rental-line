const express = require('express')
const router = require('express').Router()
const linebot = require('linebot')
const Controllers = require('../controllers')


// 鉅泰
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
bot.on('message', async function (event) {
    // 確認收到的訊息是否為 "綁定"
     if (event.message.type === 'text' && event.message.text === '帳務資訊') {
      try {
        // 若訊息為 "綁定"，取得用戶的 profile
        const profile = await event.source.profile();  // 取得 profile
        const ID = profile.userId;
        const url=`http://122.116.23.30:3347/basic-info/AccessControl?userId=${ID}`
       
        const messages = [
            {
              type: "template",
              altText: "點擊此連結進行帳務資訊查詢",
              template: {
                type: "buttons",
                text: `Hello ${profile.displayName}，點擊下方按鈕選擇功能：`,
                actions: [
                  {
                    type: "uri",
                    label: "綁定帳號",
                    uri: url
                  },
                  {
                    type: "uri",
                    label: "帳務查詢網站",
                    uri: 'http://122.116.23.30:3346/#/login'
                  }
                ]
              }
            }
          ];
  
        // 發送訊息
        await event.reply(messages);
        console.log(profile);  // 印出 profile 資訊
  
      } catch (error) {
        console.error('Error:', error);  // 捕捉錯誤並打印
        event.reply('發生錯誤，請稍後再試。');
      }
    }
  });

module.exports = router;
