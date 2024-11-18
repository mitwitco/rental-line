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



    return {
        // LINE 綁定
        linkLine: async (req, res) => {
            try {
                console.log(req)
                const time = getDateTime()
                console.log(time + ' LINE 綁定(linkLine)')
                if ( req.body.vat_number || req.body.memberLineId){

                    // 使用身分證/統編 查詢客戶代號 
                    const customerList = await customer.findAll({
                        where: {
                            vat_number: { [Op.eq]: req.body.vat_number }
                        },
                        attributes: ['cus_code', 'vat_number'],
                        raw: true
                    })
                    // 使用lineId查詢memberId
                    const memberList = await line_member.findAll({
                        where: {
                            memberLineId: { [Op.eq]: req.body.memberLineId }
                        },
                        attributes: ['memberId', 'memberProfileName', 'memberLineId'],
                        raw: true
                    })
                    // 查詢此客戶綁定數(LINE)
                    const contactList = await contact.findAll({
                        where: {
                            customerId: { [Op.eq]: customerList[0].cus_code },
                            isLine: { [Op.eq]: '1' },
                            deleteTime: { [Op.eq]: '0' }
                        },
                        attributes: ['customerId', [Sequelize.fn('COUNT', Sequelize.col('contactId')), 'count']],
                        raw: true
                    })
                    if (contactList[0].count < 2) {
                        // 新增聯絡人
                        await contact.create({
                            customerId: customerList[0].cus_code,
                            isLine: '1',
                            memberId: memberList[0].memberId,
                            name: memberList[0].memberProfileName,
                            billNotify: req.body.billNotify,
                            billMail: req.body.billMail == '' ? null : req.body.billMail,
                            messageNotify: req.body.messageNotify,
                            mobile: req.body.mobile == '' ? null : req.body.mobile,
                            messageMail: req.body.messageMail == '' ? null : req.body.messageMail,
                            createTime: time
                        })
                        console.log({ returnCode: 0, message: "LINE 綁定成功" })
                        return res.json({ returnCode: 0, message: "LINE 綁定成功" })
                    } else {
                        console.log({ returnCode: -1, message: "LINE 綁定失敗，已有綁定紀錄" })
                        return res.json({ returnCode: -1, message: "LINE 綁定失敗，已有綁定紀錄" })
                    }
                } else {
                    console.log({ returnCode: -2, message: "LINE 綁定失敗，缺少參數" })
                    return res.json({ returnCode: -2, message: "LINE 綁定失敗，缺少參數" })
                }
            } catch (err) {
                console.log({ returnCode: 500, message: "系統錯誤", err: err })
                return res.json({ returnCode: 500, message: "系統錯誤", err: err })
            }
        },
    }
}