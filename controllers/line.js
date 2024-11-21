module.exports = ({ sequelize }) => {
    const express = require('express')
    const { line_member, contact } = sequelize
    const Sequelize = require('sequelize');
    const Op = Sequelize.Op;
    const dayjs = require('dayjs')
    const axios = require('axios')
    const utc = require('dayjs/plugin/utc')
    const timezone = require('dayjs/plugin/timezone')

    const getDateTime = (input = null, timeFormat = 'YYYY-MM-DD HH:mm:ss') => {
        dayjs.extend(utc)
        dayjs.extend(timezone)
        let date = input ? input : new Date();
        const utcTime = dayjs(date).utc()
        // 將時區設定為台北
        const taiwanTime = utcTime.tz('Asia/Taipei');
        let dateTime = taiwanTime.format(timeFormat)
        return dateTime
    }

    return {
        // 處理 LINE 加好友事件
        linejoin: async (req, res) => {
            try {
                console.log(req)
                const time = getDateTime()
                console.log(time + ' 處理 LINE 加好友事件(linejoin)')
                const userId = req.source.userId
                const profile = await req.source.profile()
                // 處理使用者加入好友事件
                const memberList = await line_member.findAll({
                    where: { memberLineId: { [Op.eq]: userId }, companyId: { [Op.eq]: "1" } },
                    raw: true
                })
                console.log(memberList.length)
                if (memberList.length > 0) {
                    // 封鎖後重新加入好友
                    await line_member.update({
                        memberProfileName: profile.displayName,
                        memberBlockedTime: null,
                        memberUpdateTime: time,
                    }, {
                        where: {
                            memberId: { [Op.eq]: memberList[0].memberId }
                        }
                    })
                } else {
                    await line_member.create({
                        companyId: "1",
                        memberLineId: userId,
                        memberProfileName: profile.displayName,
                        memberJoinTime: time,
                    })
                }
                //JASON 綁定
                const url = `http://122.116.23.30:3347/basic-info/AccessControl?userId=${userId}`
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
                                    uri: url
                                }
                            ]
                        }
                    }
                ];
                // 發送訊息
                await req.reply(messages);
                console.log({ returnCode: 0, message: "處理 LINE 加好友事件" })
                return { returnCode: 0, message: "處理 LINE 加好友事件" }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return { returnCode: 500, message: "系統錯誤", err: err }
            }
        },
        // 處理 LINE 封鎖事件
        lineUnjoin: async (req, res) => {
            try {
                console.log(req)
                const time = getDateTime()
                console.log(time + ' 處理 LINE 封鎖事件(lineUnjoin)')
                // // 處理使用者加入好友事件
                const userId = req.source.userId
                // 處理使用者加入好友事件
                const memberList = await line_member.findAll({
                    where: { memberLineId: { [Op.eq]: userId }, companyId: { [Op.eq]: "1" } },
                    raw: true
                })
                console.log(memberList.length)
                if (memberList.length > 0) {
                    await line_member.update({
                        memberBlockedTime: time,
                    }, {
                        where: {
                            memberId: { [Op.eq]: memberList[0].memberId }
                        }
                    })
                }
                console.log(memberList[0].memberId)
                await contact.update({
                    mode: "2",
                    deleteTime: time,
                }, {
                    where: {
                        memberId: { [Op.eq]: memberList[0].memberId }
                    }
                })
                console.log({ returnCode: 0, message: "處理 LINE 封鎖事件" })
                return { returnCode: 0, message: "處理 LINE 封鎖事件" }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return { returnCode: 500, message: "系統錯誤", err: err }
            }
        },
        //JASON
        linemessage: async (req, res) => {
            {

                // 確認收到的訊息是否為 "綁定"
                if (req.message.type === 'text' && req.message.text === '帳務資訊') {
                    try {
                        // 若訊息為 "綁定"，取得用戶的 profile
                        const profile = await req.source.profile();  // 取得 profile
                        const ID = profile.userId;
                        let resData = ''
                        const url = `http://122.116.23.30:3347/basic-info/AccessControl?userId=${ID}`
                        try {
                            const postdata = {
                                memberLineId: ID
                            }
                            const response = await axios.post('http://122.116.23.30:3347/link/balance', postdata);
                            resData = response.data.data[0];
                        } catch (error) {
                            console.error('查詢餘額API有誤', error);
                        }
                        const messages = [
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
                                            uri: url
                                        },
                                        {
                                            type: "uri",
                                            label: "帳務查詢網站",
                                            uri: 'http://122.116.23.30:3346/#/login'
                                        }
                                    ]
                                }
                            },
                            { type: "text", text: `帳務資訊：\n客戶代號：${JSON.stringify(resData.cus_code)}\n客戶名稱：${JSON.stringify(resData.cus_name)}\n目前餘額：${JSON.stringify(resData.month_balance)}\n最後更新時間：${JSON.stringify(resData.dateTime)} ` },
                        ];

                        // 發送訊息
                        await req.reply(messages);

                        console.log(profile);  // 印出 profile 資訊

                    } catch (error) {
                        console.error('Error:', error);  // 捕捉錯誤並打印
                        req.reply('發生錯誤，請稍後再試。');
                    }
                }
            }
        }

    }
}