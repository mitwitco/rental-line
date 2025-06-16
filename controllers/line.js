module.exports = ({ sequelize }) => {
  const express = require("express");
  const { line_message} = sequelize;
  const Sequelize = require("sequelize");
  const Op = Sequelize.Op;
  const dayjs = require("dayjs");
  const axios = require("axios");
  const utc = require("dayjs/plugin/utc");
  const timezone = require("dayjs/plugin/timezone");
  const bot = require("../config/bot.js"); // 從 bot.js 導入 bot
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
  const today = new Date();
  today.setMonth(today.getMonth() - 1);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  let search_month = `${year}-${month}`;
  const Modselect = async () => {
    try {
      let mids;
        mids = await line_message.sequelize.query(
          `
          SELECT * FROM notify where  timeStamp='0' and mode ='2'
      
        `,
          {
            type: line_message.sequelize.QueryTypes.SELECT, // 使用 SELECT 查询类型
          }
        );
      return mids; // 返回篩選結果
    } catch (error) {
      console.error("Error in linepush:", error);
      throw error;
    }
  };
  const insertnotify = async (lineMid,resp_message) => {
    const time = getDateTime();
    try {
        await line_message.sequelize.query(
          `
          INSERT INTO notify (lineMid, mode, resp_message, timeStamp)
          VALUES (:lineMid, :mode, :resp_message, :timeStamp)
        `,
        {
          replacements: {
            lineMid: lineMid,
            mode: '1',
            resp_message: resp_message,
            timeStamp: time,
          },
          type: line_message.sequelize.QueryTypes.INSERT,
        }
        );
    } catch (error) {
      console.error("Error in linepush:", error);
    }
  };
  const MesUpdate = async (id,status) => {
    const time = getDateTime();
    try {
      await line_message.sequelize.query(
        `
        UPDATE notify 
        SET 
          timeStamp = :timeStamp,
          status= :status
        WHERE id = :id
        `,
        {
          replacements: {
            id: id,
            status:status,
            timeStamp: time,

          },
          type: line_message.sequelize.QueryTypes.UPDATE,
        }
      );
    } catch (error) {
      console.error("Error in MesUpdate:", error);
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
        //處理使用者加入好友事件
        const memberList = await line_message.findAll({
          where: {
            memberLineId: { [Op.eq]: userId }
          },
          raw: true,
        });
        console.log(memberList.length);
        if (memberList.length > 0) {
          // 封鎖後重新加入好友
          await line_message.update(
            {
              memberProfileName: profile.displayName,
              memberBlockedTime: null,
              memberUpdateTime: time,
            },
            {
              where: {
                line_messageId: { [Op.eq]: memberList[0].line_messageId },
              },
            }
          );
        } else {
          await line_message.create({
            memberLineId: userId,
            memberProfileName: profile.displayName,
            memberJoinTime: time,
          });
        }
        // //JASON 綁定
        const url = `https://www.google.com.tw/?hl=zh_TW`;
        const messages = [
          {
            type: "template",
            altText: "HI!",
            template: {
              type: "buttons",
              text: `您好！\n\n！`,
              actions: [
                {
                  type: "uri",
                  label: "按鈕",
                  uri: url,
                },
              ],
            },
          },
        ];
        // // 發送訊息
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
        console.log(time + "測試IP");
        // // 處理使用者加入好友事件
        const userId = req.source.userId;
        // 處理使用者加入好友事件
        const memberList = await line_message.findAll({
          where: {
            memberLineId: { [Op.eq]: userId },
          },
          raw: true,
        });
        console.log(memberList.length);
        if (memberList.length > 0) {
          await line_message.update(
            {
              memberBlockedTime: time,
            },
            {
              where: {
                line_messageId: { [Op.eq]: memberList[0].line_messageId },
              },
            }
          );
        }
        console.log(memberList[0].line_messageId);
        // await contact.update(
        //   {
        //     mode: "2",
        //     deleteTime: time,
        //   },
        //   {
        //     where: {
        //       memberId: { [Op.eq]: memberList[0].memberId },
        //     },
        //   }
        // );
        console.log({ returnCode: 0, message: "處理 LINE 封鎖事件" });
        return { returnCode: 0, message: "處理 LINE 封鎖事件" };
      } catch (err) {
        console.log({ returnCode: 500, message: "系統錯誤", err: err });
        return { returnCode: 500, message: "系統錯誤", err: err };
      }
    },
    linemessage: async (req, res) => {
      {
        const profile = await req.source.profile();
        const userId = req.source.userId;
        // 確認收到的訊息是否為 "月租服務"
        if (req.message.type === "text" && req.message.text === "月租服務") { 
              messages = [
                {
                  type: "template",
                  altText: "月租服務",
                  template: {
                    type: "buttons",
                    text: `提供月租會員場站各項服務通知及電子帳單`,
                    actions: [
                      {
                        type: "uri",
                        label: "📝服務註冊",
                        uri:`https://rental.mitwit-cre.com.tw/car-view?mid=${userId}&openExternalBrowser=1&bQz0fX8f=FPHHQsP7AMckqKe1nfL9`,
                      },
                      {
                        type: "uri",
                        label: "💰月租繳費",
                        uri: `https://rental.mitwit-cre.com.tw/?mid=${userId}&openExternalBrowser=1&bQz0fX8f=FPHHQsP7AMckqKe1nfL9`,
                      },
                      // {
                      //   type: "uri",
                      //   label: "👨‍💻會員服務",
                      //   uri: `https://rental.mitwit-cre.com.tw/?mid=${userId}&openExternalBrowser=1&bQz0fX8f=FPHHQsP7AMckqKe1nfL9`,
                      // },
                      // {
                      //   type: "uri",
                      //   label: "🙂開始登記",
                      //   uri: "https://jutai.mitwit-cre.com.tw/login?openExternalBrowser=1",
                      // },
                    ],
                  },
                },
              ];
              await req.reply(messages); //發送
            } else if (req.message.type === "text" && req.message.text === "臨停服務") { 

            } else if (req.message.type === "text") {
              await insertnotify(userId,req.message.text); 
            }
        }
    },
    linepushCron: async (bot) => {
      try {
        const mids = await Modselect(); 
        console.log("Line需發送筆數：" + mids.length);
        for (const odj of mids) {
          const cleaned = odj.req_message.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');
          console.log(cleaned)
          const message = {
            type: "text",
            text: `${cleaned}`,
          };
          try {
            await bot.push(odj.lineMid, message); // 推送訊息
            await MesUpdate(odj.id, "成功"); 
            console.log(`Message successfully pushed to ${odj.lineMid}`);
          } catch (error) {
            await MesUpdate(odj.id, error); 
            console.error(
              `Error pushing message to ${odj.lineMid}:`,
              error
            );
          }
        }
      } catch (error) {
        await MesUpdate(odj.id, error); 
        console.error("Error in CronJob:", error);
      }
    },
  };
  
};
