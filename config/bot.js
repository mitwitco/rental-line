const linebot = require('linebot')
//測試
// const bot = linebot({
//     channelId: '2007316851',
//     channelSecret: '1f1b6fb91a5fbfc63104d068b73d8fb0',
//     channelAccessToken: 'YHyTiTIzuvRuFhllUAnPaAKC8j6WBoSR34e8GBICijtwqiMfzdxq2esCy1wHckal3MxJqvF1l+w0i44+kwJWAB tEog9m/XkOg+yUwRmo7PDKDh/75//rcACh7BS7N6YbmAvcAwN9+CZjAeXOj6f4mQdB04t89/1O/w1cDnyilFU=',
// })
const bot = linebot({
    channelId: '2007141646',
    channelSecret: '1719b9436e618eb327431a1994093e45',
    channelAccessToken: 'l1PQfx5Nvw6l2/5RRtLIc6J1eas+Ohxqe4xs7ckiaFYHiVVNYEkDmTSGSG9537VBFASvcTbI6eSWiy75dpd048ME/41Qri7LKgKl3Y0w1h+AIxBEwVKxCKwXZcENHXwFU4K4Zvazvx7+bXgia49ErQdB04t89/1O/w1cDnyilFU=+w0i44+kwJWAB tEog9m/XkOg+yUwRmo7PDKDh/75//rcACh7BS7N6YbmAvcAwN9+CZjAeXOj6f4mQdB04t89/1O/w1cDnyilFU=',
})

module.exports = bot; // 將 bot 導出