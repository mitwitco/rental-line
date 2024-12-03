const express = require('express')
const router = require('express').Router()
const linebot = require('linebot')
const Controllers = require('../controllers')
const { CronJob } = require('cron');

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
bot.on('message',Controllers.line.linemessage );
line.start();

const line = new CronJob('*/1 * * * *', async () => {
    try {
      // 調用 Controllers 中的篩選方法
      const mids = await Controllers.line.linepush();
    
      for (const odj of mids) {
        const message = {
          type: 'text',
          text: `${odj.title}\n${odj.cusName} 您好!\n${odj.content} `
        };
        try {
          await bot.push(odj.connectionId, message); // 推送訊息
          await Controllers.line.linepushUpdate(odj.id, "2"); // 推送成功，更新 sendType 為 "2"
          console.log(`Message successfully pushed to ${odj.connectionId}`);
        } catch (error) {
          console.error(`Error pushing message to ${odj.connectionId}:`, error);
          try {
            await Controllers.line.linepushUpdate(odj.id, "3"); // 推送失敗，更新 sendType 為 "3"
          } catch (updateError) {
            console.error(`Error updating sendType to "3" for id ${odj.id}:`, updateError);
          }
        }
      }
    } catch (error) {
      console.error('Error in CronJob:', error);
    }
  });
  


module.exports = router;
