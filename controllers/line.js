module.exports = ({ sequelize }) => {
  const express = require("express");
  const { line_member, contact, defnotify } = sequelize;
  const Sequelize = require("sequelize");
  const Op = Sequelize.Op;
  const dayjs = require("dayjs");
  const axios = require("axios");
  const utc = require("dayjs/plugin/utc");
  const timezone = require("dayjs/plugin/timezone");

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
        mids = await defnotify
          .findAll({ where: { customerId:"G1308719",sendMod: "1", sendType: "5" } })
          .catch((error) => {
            console.error("Error finding record:", error);
          });
      } else if (sendMod == "2") {
        mids = await defnotify
          .findAll({ where: { customerId:"G1308719",sendMod: "2", sendType: "5" } })
          .catch((error) => {
            console.error("Error finding record:", error);
          });
      } else if (sendMod == "3") {
        mids = await defnotify
          .findAll({ where: { customerId:"G1308719",sendMod: "3", sendType: "5" } })
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
              // API 回傳成功，提取客戶資料
              const resData = response.data.data;
              let textMessage = "帳務資訊：\n";
              // 遍歷每筆資料，將資料格式化並串接
              resData.forEach((data, index) => {
                textMessage += `客戶代號：${data.cus_code}\n客戶名稱：${data.cus_name}\n目前餘額：${data.month_balance}\n最後更新時間：${data.dateTime}\n`;
                // 在每筆資料之間加上分隔線
                if (index < resData.length - 1) {
                  textMessage += "--------\n";
                }
              });
              messages = [
                {
                  type: "text",
                  text: textMessage,
                },
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
            }

            await req.reply(messages); //發送
            console.log(profile); // 印出 profile 資訊
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
        // for (const odj of mids) {
        //   const message = {
        //     type: "text",
        //     text: `${odj.title}\n${odj.cusName} 您好!\n${odj.content} `,
        //   };
        //   try {
        //     await bot.push(odj.connectionId, message); // 推送訊息
        //     await MesUpdate(odj.id, "2"); // 推送成功，更新 sendType 為 "2"
        //     console.log(`Message successfully pushed to ${odj.connectionId}`);
        //   } catch (error) {
        //     await MesUpdate(odj.id, "3"); // 推送失敗，更新 sendType 為 "3"
        //     console.error(
        //       `Error pushing message to ${odj.connectionId}:`,
        //       error
        //     )
        //   }
        // }
      } catch (error) {
        console.error("Error in CronJob:", error);
      }
    },
    linepushCron: async (bot) => {
      try {
        // 調用 Controllers 中的篩選方法
        const mids = await Modselect("2"); //2為Line
        console.log("Line需發送筆數：" + mids.length);
        // for (const odj of mids) {
        //   const message = {
        //     type: "text",
        //     text: `${odj.title}\n${odj.cusName} 您好!\n${odj.content} `,
        //   };
        //   try {
        //     await bot.push(odj.connectionId, message); // 推送訊息
        //     await MesUpdate(odj.id, "2"); // 推送成功，更新 sendType 為 "2"
        //     console.log(`Message successfully pushed to ${odj.connectionId}`);
        //   } catch (error) {
        //     await MesUpdate(odj.id, "3"); // 推送失敗，更新 sendType 為 "3"
        //     console.error(
        //       `Error pushing message to ${odj.connectionId}:`,
        //       error
        //     )
        //   }
        // }
      } catch (error) {
        await MesUpdate(odj.id, "3"); // 推送失敗，更新 sendType 為 "3"
        console.error("Error in CronJob:", error);
      }
    },
    mailCron: async (transporter) => {
      try {
        const mids = await Modselect("3"); //3為mail
        console.log("Mail需發送筆數：" + mids.length);
        // for (const odj of mids) {
        //   const mailOptions = {
        //     from: '鉅泰創新股份有限公司<eric@jutai.net>',
        //     to:odj.connectionId, // 或從 req.body 取得
        //     subject:odj.title,
        //     html:`${odj.cusName} 您好!\n${odj.content}`,
        //   };
        //   try {
        //     // 發送信件並等待結果
        //     const info = await transporter.sendMail(mailOptions);
        //     await MesUpdate(odj.id, "2"); // 推送成功，更新 sendType 為 "2"
        //     console.log('郵件發送成功:', info);
        //   } catch (error) {
        //     await MesUpdate(odj.id, "3"); // 推送失敗，更新 sendType 為 "3"
        //     console.error('郵件發送失敗:', error);
        //   }
        // }
      } catch (error) {
        await MesUpdate(odj.id, "3"); // 推送失敗，更新 sendType 為 "3"
        console.error("Error in CronJob:", error);
      }
    },
  };
};
