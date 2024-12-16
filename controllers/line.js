module.exports = ({ sequelize }) => {
  const express = require("express");
  const { line_member, contact, defnotify } = sequelize;
  const Sequelize = require("sequelize");
  const Op = Sequelize.Op;
  const dayjs = require("dayjs");
  const axios = require("axios");
  const utc = require("dayjs/plugin/utc");
  const timezone = require("dayjs/plugin/timezone");
  const targetCustomerIds = [
    "G2200233",
    "G2200195",
    "G2100002",
    "G2100001",
    "G1308719",
  ];
  const thousandthsFormat = (value) => {
    value = parseInt(value);
    if (isNaN(value)) return;
    return value.toLocaleString();
  };
  const getDateTime = (input = null, timeFormat = "YYYY-MM-DD HH:mm:ss") => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    let date = input ? input : new Date();
    const utcTime = dayjs(date).utc();
    // 將時區設定為台北
    const taiwanTime = utcTime.tz("Asia/Taipei");
    let dateTime = taiwanTime.format(timeFormat);
    return dateTime;
  };
  const Modselect = async (sendMod) => {
    try {
      // 模擬篩選需要發送的客戶資料
      let mids;
      // const mids =  [
      //   { mid: 'U49ab41e8be6dadaa0fca24ea805b78b36' },
      //   { mid: 'U49ab41e8be6dadaa0fca24ea805b78b367' }
      // ];
      if (sendMod == "1") {
        //手機
        mids = await defnotify
          .findAll({
            where: { sendMod: "1", sendType: "1" },
          })
          .catch((error) => {
            console.error("Error finding record:", error);
          });
      } else if (sendMod == "2") {
        //LINE
        mids = await defnotify
          .findAll({
            where: { sendMod: "2", sendType: "1" },
          })
          .catch((error) => {
            console.error("Error finding record:", error);
          });
      } else if (sendMod == "3") {
        //MAIL
        mids = await defnotify
          .findAll({
            where: { sendMod: "3", sendType: "1" },
          })
          .catch((error) => {
            console.error("Error finding record:", error);
          });
      }

      return mids; // 返回篩選結果
    } catch (error) {
      console.error("Error in linepush:", error);
      throw error;
    }
  };
  const MesUpdate = async (id, sendType) => {
    const time = getDateTime();
    try {
      await defnotify.update(
        {
          sendType,
          sendTime: time,
        },
        {
          where: {
            id: { [Op.eq]: id },
          },
        }
      );
    } catch (error) {
      console.error("Error in linepush:", error);
      throw error;
    }
  };
  return {
    // 處理 LINE 加好友事件
    linejoin: async (req, res) => {
      try {
        console.log(req);
        const time = getDateTime();
        console.log(time + " 處理 LINE 加好友事件(linejoin)");
        const userId = req.source.userId;
        const profile = await req.source.profile();
        // 處理使用者加入好友事件
        const memberList = await line_member.findAll({
          where: {
            memberLineId: { [Op.eq]: userId },
            companyId: { [Op.eq]: "1" },
          },
          raw: true,
        });
        console.log(memberList.length);
        if (memberList.length > 0) {
          // 封鎖後重新加入好友
          await line_member.update(
            {
              memberProfileName: profile.displayName,
              memberBlockedTime: null,
              memberUpdateTime: time,
            },
            {
              where: {
                memberId: { [Op.eq]: memberList[0].memberId },
              },
            }
          );
        } else {
          await line_member.create({
            companyId: "1",
            memberLineId: userId,
            memberProfileName: profile.displayName,
            memberJoinTime: time,
          });
        }
        //JASON 綁定
        const url = `http://122.116.23.30:3347/basic-info/AccessControl?userId=${userId}`;
        const messages = [
          {
            type: "template",
            altText: "點擊此連結進行帳務資訊查詢",
            template: {
              type: "buttons",
              text: `${profile.displayName}您好！\n\n感謝您支持鉅泰創新中油車隊卡\n請您點選下方按鈕做綁定帳號\n\n如尚未簽約，請先發訊息給小幫手作協助\n\n祝您行車順利，業績長紅！`,
              actions: [
                {
                  type: "uri",
                  label: "綁定帳號",
                  uri: url,
                },
              ],
            },
          },
        ];
        // 發送訊息
        await req.reply(messages);
        console.log({ returnCode: 0, message: "處理 LINE 加好友事件" });
        return { returnCode: 0, message: "處理 LINE 加好友事件" };
      } catch (err) {
        console.log({ returnCode: 500, message: "系統錯誤", err: err });
        return { returnCode: 500, message: "系統錯誤", err: err };
      }
    },
    // 處理 LINE 封鎖事件
    lineUnjoin: async (req, res) => {
      try {
        console.log(req);
        const time = getDateTime();
        console.log(time + " 處理 LINE 封鎖事件(lineUnjoin)");
        // // 處理使用者加入好友事件
        const userId = req.source.userId;
        // 處理使用者加入好友事件
        const memberList = await line_member.findAll({
          where: {
            memberLineId: { [Op.eq]: userId },
            companyId: { [Op.eq]: "1" },
          },
          raw: true,
        });
        console.log(memberList.length);
        if (memberList.length > 0) {
          await line_member.update(
            {
              memberBlockedTime: time,
            },
            {
              where: {
                memberId: { [Op.eq]: memberList[0].memberId },
              },
            }
          );
        }
        console.log(memberList[0].memberId);
        await contact.update(
          {
            mode: "2",
            deleteTime: time,
          },
          {
            where: {
              memberId: { [Op.eq]: memberList[0].memberId },
            },
          }
        );
        console.log({ returnCode: 0, message: "處理 LINE 封鎖事件" });
        return { returnCode: 0, message: "處理 LINE 封鎖事件" };
      } catch (err) {
        console.log({ returnCode: 500, message: "系統錯誤", err: err });
        return { returnCode: 500, message: "系統錯誤", err: err };
      }
    },
    //JASON
    linemessage: async (req, res) => {
      {
        // 確認收到的訊息是否為 "綁定"
        if (req.message.type === "text" && req.message.text === "帳務資訊") {
          try {
            // 若訊息為 "綁定"，取得用戶的 profile
            const profile = await req.source.profile(); // 取得 profile
            const ID = profile.userId;
            const url = `http://122.116.23.30:3347/basic-info/AccessControl?userId=${ID}`;
            let messages = [];
            let response;
            try {
              const postdata = {
                memberLineId: ID,
              };
              response = await axios.post(
                "http://122.116.23.30:3347/link/balance",
                postdata
              );
            } catch (apiError) {
              console.error("API 查詢餘額發生錯誤:", apiError);
            }

            if (
              response &&
              response.status === 200 &&
              response.data.returnCode === 0
            ) {
              // // API 回傳成功，提取客戶資料
              // const resData = response.data.data;
              // let textMessage = "帳務資訊：\n";
              // // 遍歷每筆資料，將資料格式化並串接
              // resData.forEach((data, index) => {
              //   textMessage += `客戶代號：${data.cus_code}\n客戶名稱：${
              //     data.cus_name
              //   }\n目前餘額：${thousandthsFormat(
              //     data.month_balance
              //   )}\n最後更新時間：${data.dateTime}\n`;
              //   // 在每筆資料之間加上分隔線
              //   if (index < resData.length - 1) {
              //     textMessage += "--------\n";
              //   }
              // });
              const resData = response.data.data;
              const bubbles = resData.map((data) => ({
                type: "bubble",
                direction: "ltr",
                hero: {
                  type: "image",
                  url: "https://i.postimg.cc/QCVpCy3w/message-Image-1699596069899.jpg",
                  size: "full",
                  aspectRatio: "20:13",
                  aspectMode: "fit",
                  margin: "none",
                  align: "center",
                  gravity: "center",
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: "帳務資訊",
                      weight: "bold",
                      size: "xl",
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      margin: "lg",
                      spacing: "sm",
                      contents: [
                        {
                          type: "box",
                          layout: "baseline",
                          spacing: "sm",
                          contents: [
                            {
                              type: "text",
                              text: "客戶代號：",
                              color: "#aaaaaa",
                              size: "sm",
                              flex: 2,
                              margin: "none",
                            },
                            {
                              type: "text",
                              text: `${data.cus_code}`,
                              wrap: true,
                              color: "#666666",
                              size: "sm",
                              flex: 5,
                            },
                          ],
                        },
                        {
                          type: "box",
                          layout: "baseline",
                          spacing: "sm",
                          contents: [
                            {
                              type: "text",
                              text: "客戶名稱：",
                              color: "#aaaaaa",
                              size: "sm",
                              flex: 2,
                            },
                            {
                              type: "text",
                              text: `${data.cus_name}`,
                              wrap: true,
                              color: "#666666",
                              size: "sm",
                              flex: 5,
                            },
                          ],
                        },
                        {
                          type: "box",
                          layout: "baseline",
                          contents: [
                            {
                              type: "text",
                              text: "目前餘額：",
                              color: "#aaaaaa",
                              size: "sm",
                              flex: 2,
                            },
                            {
                              type: "text",
                              text: `${thousandthsFormat(data.month_balance)}`,
                              wrap: true,
                              color: "#666666",
                              size: "sm",
                              flex: 5,
                            },
                          ],
                        },
                        {
                          type: "box",
                          layout: "baseline",
                          contents: [
                            {
                              type: "text",
                              text: "更新時間：",
                              color: "#aaaaaa",
                              size: "sm",
                              flex: 2,
                            },
                            {
                              type: "text",
                              text: `${data.dateTime}`,
                              wrap: true,
                              color: "#666666",
                              size: "sm",
                              flex: 5,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              }));
              for (const bubble of bubbles) {
                const flex = {
                  type: "flex",
                  altText: "帳務資訊",
                  contents: bubble, // 單獨的 bubble
                };
              
                await req.reply(flex); //發送
              }
              messages = [
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
                        uri: url,
                      },
                      {
                        type: "uri",
                        label: "帳務查詢網站",
                        uri: "http://122.116.23.30:3346/#/login",
                      },
                    ],
                  },
                },
              ];
              await req.reply(messages); //發送
            } else {
              // 查詢失敗或未綁定帳號
              messages = [
                { type: "text", text: "請先綁定帳號，才能進行帳務資訊查詢。" },
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
                        uri: url,
                      },
                      {
                        type: "uri",
                        label: "帳務查詢網站",
                        uri: "http://122.116.23.30:3346/#/login",
                      },
                    ],
                  },
                },
              ];
              await req.reply(messages); //發送
              console.log(profile); // 印出 profile 資訊
            }
          } catch (error) {
            console.error("Error:", error); // 捕捉錯誤並打印
            req.reply("發生錯誤，請稍後再試。");
          }
        }
      }
    },
    phoneCron: async () => {
      try {
        const mids = await Modselect("1"); //1為手機簡訊
        console.log("手機簡訊需發送筆數：" + mids.length);
        for (const odj of mids) {
          if (targetCustomerIds.includes(odj.customerId)) {
            console.log("要發送" + JSON.stringify(odj.customerId));
            if (odj.connectionId.length === 10) {
              odj.connectionId = "886" + odj.connectionId.slice(1);
            } else {
              console.log(odj.connectionId + "號碼錯誤");
              await MesUpdate(odj.id, "4"); // 推送失敗，電話格式不對 更新 sendType 為 "4"
              continue;
            }
            let query = `${odj.cusName} 您好!\n${odj.content}`;
            // 構建表單數據
            const formData = new URLSearchParams();
            formData.append("username", "42993157");
            formData.append("password", "uu42993157");
            formData.append("dstaddr", odj.connectionId);
            formData.append("smbody", query);
            formData.append("smsPointFlag", "1"); // 假設你要設置這個標誌為 1

            try {
              //發送 POST 請求
              const response = await axios.post(
                "https://smsapi.mitake.com.tw/api/mtk/SmSend?CharsetURL=UTF-8",
                formData.toString(),
                {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                }
              );
              const lines = response.data.split("\r\n");
              const result = {};
              lines.forEach((line) => {
                if (line.includes("=")) {
                  const [key, value] = line.split("=");
                  result[key.trim()] = value.trim();
                }
              });
              console.log(JSON.stringify(result));
              if (result.statuscode >= 0 && result.statuscode <= 4) {
                await MesUpdate(odj.id, "2"); // 推送成功，更新 sendType 為 "2"
                console.log(odj.connectionId + "傳送成功！");
                console.log("SMS 消耗點數：", result.smsPoint);
                console.log("剩餘帳號點數：", result.AccountPoint);
              } else {
                await MesUpdate(odj.id, "3"); // 推送失敗，更新 sendType 為 "3"
                console.error(odj.connectionId + "傳送失敗！");
                console.log("錯誤代碼：", result.statuscode);
                console.log("剩餘帳號點數：", result.AccountPoint);
              }
            } catch (error) {
              await MesUpdate(odj.id, "3"); // 推送失敗，更新 sendType 為 "3"
              console.error("Error sending SMS:", error);
            }
          }
        }
      } catch (error) {
        await MesUpdate(odj.id, "3"); // 推送失敗，更新 sendType 為 "3"
        console.error("Error in CronJob:", error);
      }
    },
    linepushCron: async (bot) => {
      try {
        // 調用 Controllers 中的篩選方法
        const mids = await Modselect("2"); //2為Line
        console.log("Line需發送筆數：" + mids.length);
        for (const odj of mids) {
          if (targetCustomerIds.includes(odj.customerId)) {
            console.log("要發送" + JSON.stringify(odj.customerId));

            const message = {
              type: "text",
              text: `${odj.cusName} 您好!\n${odj.content} `,
            };
            try {
              await bot.push(odj.connectionId, message); // 推送訊息
              await MesUpdate(odj.id, "2"); // 推送成功，更新 sendType 為 "2"
              console.log(`Message successfully pushed to ${odj.connectionId}`);
            } catch (error) {
              await MesUpdate(odj.id, "3"); // 推送失敗，更新 sendType 為 "3"
              console.error(
                `Error pushing message to ${odj.connectionId}:`,
                error
              );
            }
          }
        }
      } catch (error) {
        await MesUpdate(odj.id, "3"); // 推送失敗，更新 sendType 為 "3"
        console.error("Error in CronJob:", error);
      }
    },
    mailCron: async (transporter) => {
      try {
        const mids = await Modselect("3"); //3為mail
        console.log("Mail需發送筆數：" + mids.length);
        for (const odj of mids) {
          if (targetCustomerIds.includes(odj.customerId)) {
            console.log("要發送" + JSON.stringify(odj.customerId));

            const mailOptions = {
              from: "鉅泰創新股份有限公司<invoice@jutai.net>",
              to: odj.connectionId, // 或從 req.body 取得
              subject: odj.subject,
              html: `${odj.cusName} 您好!<br>${odj.content.replace(
                /\n/g,
                "<br>"
              )}`,
              // attachments: [
              //   {
              //     filename: 'example.xls', // 附檔名稱
              //     path: 'F:\\G2200783_亞巨葉碧鑾物流有限公司.xls', // 附檔的路徑
              //   },
              //   // 如果需要多個檔案，可以繼續在這裡加入其他附檔
              //   {
              //     filename: 'image.png',
              //     path: './path/to/image.png',
              //   },
              // ],
            };
            try {
              // 發送信件並等待結果
              const info = await transporter.sendMail(mailOptions);
              await MesUpdate(odj.id, "2"); // 推送成功，更新 sendType 為 "2"
              console.log("郵件發送成功:", info);
            } catch (error) {
              await MesUpdate(odj.id, "3"); // 推送失敗，更新 sendType 為 "3"
              console.error("郵件發送失敗:", error);
            }
          }
        }
      } catch (error) {
        await MesUpdate(odj.id, "3"); // 推送失敗，更新 sendType 為 "3"
        console.error("Error in CronJob:", error);
      }
    },
  };
};
