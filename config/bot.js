const linebot = require('linebot')

const bot = linebot({
    channelId: '2007316851',
    channelSecret: '1f1b6fb91a5fbfc63104d068b73d8fb0',
    channelAccessToken: 'YHyTiTIzuvRuFhllUAnPaAKC8j6WBoSR34e8GBICijtwqiMfzdxq2esCy1wHckal3MxJqvF1l+w0i44+kwJWAB tEog9m/XkOg+yUwRmo7PDKDh/75//rcACh7BS7N6YbmAvcAwN9+CZjAeXOj6f4mQdB04t89/1O/w1cDnyilFU=',
})

module.exports = bot; // 將 bot 導出