const express = require("express");
const router = require("express").Router();
const bot = require("../config/bot.js"); // 從 bot.js 導入 bot
const Controllers = require("../controllers");
const { CronJob } = require("cron");


const linebotParser = bot.parser();
router.post("/linewebhook", linebotParser);


bot.on("follow", Controllers.line.linejoin);
bot.on("unfollow", Controllers.line.lineUnjoin);
//JASON
bot.on("message", Controllers.line.linemessage);
//TEST



module.exports = router;
