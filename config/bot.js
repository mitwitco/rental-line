const linebot = require('linebot')

const bot = linebot({
    channelId: '2006499890',
    channelSecret: 'e6b1723c95864e023cd4f00401a67dd5',
    channelAccessToken: '4T7B6pY+FQR9ZKZ3i51kl0UELdGNzqE/b3r8Axns5LZEO0XjZEcLDaSSZVmY2W8dhHroq5Y4ilbI562NiypQxymhKvumfGXyYnzCnoSQCpDzAwmZMJDFw6Q1uXNizbAOt+xfW9WBGPUuzb+VUSybDQdB04t89/1O/w1cDnyilFU=',
})

module.exports = bot; // 將 bot 導出