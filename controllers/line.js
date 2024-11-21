module.exports = ({ sequelize }) => {
    const express = require('express')
    const { line_member, contact } = sequelize
    const Sequelize = require('sequelize');
    const Op = Sequelize.Op;
    const dayjs = require('dayjs')

    const getDateTime = (input = null, timeFormat = 'YYYY-MM-DD HH:mm:ss') => {
        let date = input ? input : new Date();
        let dateTime = dayjs(date).format(timeFormat)
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
                const url=`http://122.116.23.30:3347/basic-info/AccessControl?userId=${userId}`
                const messages = [
                    {
                    type: "template",
                    altText: "點擊此連結進行帳務資訊查詢",
                    template: {
                        type: "buttons",
                        text: `${profile.displayName}您好！\n感謝您將本帳號加入好友!\n請您點選下方綁定按鈕做客戶綁定\n此官方帳號\n將定期發放最新資訊給您\n敬請期待!`,
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

    }
}