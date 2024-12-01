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

  async function pushTestMessage() {
    const message2 = {
      type: 'text',
      text: 'Hello! This is a test message from your LINE bot.',
    };
  
    try {
      await bot.push('U49ab41e8be6dadaa0fca24ea805b78b3', message2);
      console.log('Message pushed successfully!');
    } catch (error) {
      console.error('Error pushing message:', error);
    }
  }
  
  // 调用推送消息函数
  pushTestMessage();


const job = new CronJob('*/1 * * * *', async () => {
    const message3 = {
        type: 'text',
        text: 'Hello! This is a test message from your LINE bot.',
      };
    try {
      // 調用 Controllers 中的篩選方法
    //   const mids = await Controllers.line.linepush();
      
      await bot.push('U49ab41e8be6dadaa0fca24ea805b78b3', message3)
      // 遍歷篩選出的 MID 列表並推送訊息
    //   for (const mid of mids) {
    //     await bot.push('U49ab41e8be6dadaa0fca24ea805b78b3', message)
    //       .then(() => {
    //         console.log(`Message pushed successfully to ${mid}`);
    //       })
    //       .catch((error) => {
    //         console.error(`Error pushing message to ${mid}:`, error);
    //       });
    //   }
    } catch (error) {
      console.error('Error in CronJob:', error);
    }
  });
  job.start();
   

module.exports = router;
