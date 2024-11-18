module.exports = ({ sequelize }) => {
    const express = require('express')
    const { line_member, contact, customer } = sequelize
    const Sequelize = require('sequelize');
    const Op = Sequelize.Op;
    // const app = express()
    // const router = require('express').Router()
    // const linebot = require('linebot')
    const dayjs = require('dayjs')

    const getDateTime = (input = null, timeFormat = 'YYYY-MM-DD HH:mm:ss') => {
        let date = input ? input : new Date();
        let dateTime = dayjs(date).format(timeFormat)
        return dateTime
    }

    // const bot = linebot({
    //     channelId: '1653297247',
    //     channelSecret: 'c1329fdd614c18cf9ac76e16612ca21e',
    //     channelAccessToken: '5l38NjKeKtDQMlvUe2Y9t5i+YKtzKQCsD4RAbKFXr+Iav4Kri3aNTQ5l6kSJdb6X/ux+perukt1G3p4DXsItmPksaXCwufrXoyi6+whEK0QwKoJCnvCH5buOdtpjb3TSbb7ny5MX4GLW3Ea6jNcTXQdB04t89/1O/w1cDnyilFU=',
    // })

    // const linebotParser = bot.parser();
    // router.post('/linewebhook', linebotParser);


    return {
        // 處理 LINE 加好友事件
        linejoin: async (req, res) => {
            try {
                console.log(req)
                const time = getDateTime()
                console.log(time + ' 處理 LINE 加好友事件(linejoin)')
                const userId = req.source.userId
                const profile = await req.source.profile()
                // const member = await req.source.member()
                // console.log(userId);
                // console.log(profile.displayName);
                // console.log(member);
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
                // bot.on('follow', (event) => {
                const userId = req.source.userId
                // const profile = await req.source.profile()
                // const member = await req.source.member()
                // console.log(userId);
                // console.log(profile);
                // console.log(member);
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
        // LINE 綁定
        // linkLine: async (req, res) => {
        //     try {
        //         console.log(req)
        //         const time = getDateTime()
        //         console.log(time + ' LINE 綁定(linkLine)')
        //         // if ( req.body.vat_number || req.body.memberLineId){

        //         //     // 使用身分證/統編 查詢客戶代號 
        //         //     const customerList = await customer.findAll({
        //         //         where: {
        //         //             vat_number: { [Op.eq]: req.body.vat_number }
        //         //         },
        //         //         attributes: ['cus_code', 'vat_number'],
        //         //         raw: true
        //         //     })
        //         //     // 使用lineId查詢memberId
        //         //     const memberList = await line_member.findAll({
        //         //         where: {
        //         //             memberLineId: { [Op.eq]: req.body.memberLineId }
        //         //         },
        //         //         attributes: ['memberId', 'memberProfileName', 'memberLineId'],
        //         //         raw: true
        //         //     })
        //         //     // 查詢此客戶綁定數(LINE)
        //         //     const contactList = await contact.findAll({
        //         //         where: {
        //         //             customerId: { [Op.eq]: customerList[0].cus_code },
        //         //             isLine: { [Op.eq]: '1' },
        //         //             deleteTime: { [Op.eq]: '0' }
        //         //         },
        //         //         attributes: ['customerId', [Sequelize.fn('COUNT', Sequelize.col('contactId')), 'count']],
        //         //         raw: true
        //         //     })
        //         //     if (contactList[0].count < 2) {
        //         //         // 新增聯絡人
        //         //         await contact.create({
        //         //             customerId: customerList[0].cus_code,
        //         //             isLine: '1',
        //         //             memberId: memberList[0].memberId,
        //         //             name: memberList[0].memberProfileName,
        //         //             billNotify: req.body.billNotify,
        //         //             billMail: req.body.billMail == '' ? null : req.body.billMail,
        //         //             messageNotify: req.body.messageNotify,
        //         //             mobile: req.body.mobile == '' ? null : req.body.mobile,
        //         //             messageMail: req.body.messageMail == '' ? null : req.body.messageMail,
        //         //             createTime: time
        //         //         })
        //         //         console.log({ returnCode: 0, message: "LINE 綁定成功" })
        //         //         return { returnCode: 0, message: "LINE 綁定成功" }
        //         //     } else {
        //         //         console.log({ returnCode: -1, message: "LINE 綁定失敗，已有綁定紀錄" })
        //         //         return { returnCode: -1, message: "LINE 綁定失敗，已有綁定紀錄" }
        //         //     }
        //         // } else {
        //         //     console.log({ returnCode: -2, message: "LINE 綁定失敗，缺少參數" })
        //         //     return { returnCode: -2, message: "LINE 綁定失敗，缺少參數" }
        //         // }
        //     } catch (err) {
        //         console.log({ returnCode: 500, message: "系統錯誤", err: err })
        //         return { returnCode: 500, message: "系統錯誤", err: err }
        //     }
        // },




        // app.post('/linejoin', line.middleware(config), (req, res) => {
        //     Promise.all(req.body.events.map(handleEvent))
        //         .then((result) => res.join(result))
        //         .catch((err) => {
        //             console.error(err)
        //             res.join(err)
        //         });
        // })



    }
}