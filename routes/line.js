const express = require("express");
const router = require("express").Router();
// const linebot = require('linebot')
const bot = require("../config/bot.js"); // 從 bot.js 導入 bot
const Controllers = require("../controllers");
const { CronJob } = require("cron");
const nodemailer = require("nodemailer");

// 鉅泰
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "invoice@jutai.net",
    pass: "qivrgwnfbtsgrcix",
  },
});
// const bot = linebot({
//     channelId: '2006499890',
//     channelSecret: 'e6b1723c95864e023cd4f00401a67dd5',
//     channelAccessToken: '4T7B6pY+FQR9ZKZ3i51kl0UELdGNzqE/b3r8Axns5LZEO0XjZEcLDaSSZVmY2W8dhHroq5Y4ilbI562NiypQxymhKvumfGXyYnzCnoSQCpDzAwmZMJDFw6Q1uXNizbAOt+xfW9WBGPUuzb+VUSybDQdB04t89/1O/w1cDnyilFU=',
// })

const linebotParser = bot.parser();
router.post("/linewebhook", linebotParser);

bot.on("follow", Controllers.line.linejoin);
bot.on("unfollow", Controllers.line.lineUnjoin);
//JASON
bot.on("message", Controllers.line.linemessage);

const phoneCron = new CronJob("*/10 * * * *", async () => {
  await Controllers.line.phoneCron();
});
const lineCron = new CronJob("*/10 * * * *", async () => {
  await Controllers.line.linepushCron(bot);
});
const mailCron = new CronJob("*/10 * * * *", async () => {
  await Controllers.line.mailCron(transporter);
});
const LineSendCron = new CronJob("*/10 * * * *", async () => {
  const Mailsystemwork = await Controllers.line.selecttype("30"); //MAIL發送
  const Linesystemwork = await Controllers.line.selecttype("31"); //LINE發送
  if (Mailsystemwork.length > 0) {
    mailid = Mailsystemwork[0].id;
    mailtype = Mailsystemwork[0].type;
    mailendTime = Mailsystemwork[0].endTime;
  }
  if (mailtype == "30" && mailendTime != "0" && Linesystemwork.length == 0) {
    console.log("MAIL寄送完成&LINE未開始發送");
    console.log("新增31排成(發送LINE)");
    await Controllers.line.insertsys("31", "");
    console.log("開始發送");
    await Controllers.line.LineSendCron(bot);
    console.log("壓29結束時間");
    const systemwork = await Controllers.line.selecttype("29"); //開始寄送總排程
    const sysid = systemwork[0].id;
    await Controllers.line.UpendTime(sysid);
  }
});
phoneCron.start();
lineCron.start();
mailCron.start();
LineSendCron.start();

module.exports = router;
