// const nodemailer = require('nodemailer');
// const linebot = require('linebot');

// async function email(req,res) {
//   const { to, html } = req.body;
//   if (!to || !html) {
//     return res.status(400).json({ message: '缺少必要的郵件參數' });
//   }
//   let query = "普誠環保工程有限公司-台中分公司 您好：今日油款餘額為-100994。請務必確保油金充足，以免影響用油權益，謝謝。鉅泰窗口：02-2798-9967！";
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 465,
//       auth: {
//         user: 'eric@jutai.net',
//         pass: 'umwzuohkofvjgkuy',
//       },
//     });
//     const mailOptions = {
//       from: 'HIHI<eric@jutai.net>',
//       to, // 或從 req.body 取得
//       subject:'鉅泰',
//       html:query,
//     };
  
//     try {
//       // 發送信件並等待結果
//       const info = await transporter.sendMail(mailOptions);
//       console.log('郵件發送成功:', info);
  
//       // 返回成功回應
//       res.status(200).json({ message: '郵件發送成功', info });
//     } catch (error) {
//       console.error('郵件發送失敗:', error);
  
//       // 返回錯誤回應
//       res.status(500).json({ message: '郵件發送失敗', error });
//     }
//   };

//   const bot = linebot({
//     channelId: '2006495696',
//     channelSecret: 'cef996c7b05f995bc31415ebdaf40c10',
//   channelAccessToken:'BCtX9DdEEN8WkZp7w/wINMW9vl8GiLN4+1fgNwL9tCt2SAhmElo1IxCTcdhUBbBjusUaNgxDPeoGmSPhZbU/OceScoZybhHZSHuCbiyebiVrkEKkJyJMwURk3vjVuguAfPNBgy8TdtRkGcGma98rtwdB04t89/1O/w1cDnyilFU='
//   });
//   const linebotParser = bot.parser();

//   bot.on('message', async function (event) {
//   // 確認收到的訊息是否為 "綁定"
//    if (event.message.type === 'text' && event.message.text === '帳務資訊') {
//     try {
//       // 若訊息為 "綁定"，取得用戶的 profile
//       const profile = await event.source.profile();  // 取得 profile
//       const ID = profile.userId;
// const url=`http://122.116.23.30:3347/basic-info/AccessControl?userId=${ID}`
//       // 使用 axios 發送 API 請求
//       //const response = await axios.get(`https://example.com/api/user/${ID}`);
//       //const data = response.data;  // 假設這是從 API 回來的資料

//       const messages = [
//           {
//             type: "template",
//             altText: "點擊此連結進行帳務資訊查詢",
//             template: {
//               type: "buttons",
//               text: `Hello ${profile.displayName}，點擊下方按鈕選擇功能：`,
//               actions: [
//                 {
//                   type: "uri",
//                   label: "綁定帳號",
//                   uri: url
//                 },
//                 {
//                   type: "uri",
//                   label: "帳務查詢網站",
//                   uri: 'http://122.116.23.30:3346/#/login'
//                 }
//               ]
//             }
//           }
//         ];

//       // 發送訊息
//       await event.reply(messages);
//       console.log(profile);  // 印出 profile 資訊

//     } catch (error) {
//       console.error('Error:', error);  // 捕捉錯誤並打印
//       event.reply('發生錯誤，請稍後再試。');
//     }
//   }
// });

//   module.exports ={
//      email,linebotParser
//   } ;
  