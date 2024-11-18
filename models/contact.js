'use strict';
module.exports = (sequelize, DataTypes) => {
    const contact = sequelize.define('contact', {
        contactId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: true
        },
        customerId: { type: DataTypes.STRING, notNull: true, },
        isLine: { type: DataTypes.STRING, notNull: true, },
        memberId: { type: DataTypes.STRING, notNull: true, },
        job_title: { type: DataTypes.STRING, notNull: false, },
        gender: { type: DataTypes.STRING, notNull: false, },
        name: { type: DataTypes.STRING, notNull: false, },
        mail: { type: DataTypes.STRING, notNull: false, },
        notes: { type: DataTypes.STRING, notNull: false, },
        billNotify: { type: DataTypes.STRING, notNull: false, },
        billMail: { type: DataTypes.STRING, notNull: false, },
        messageNotify: { type: DataTypes.STRING, notNull: false, },
        mobile: { type: DataTypes.STRING, notNull: false, },
        messageMail: { type: DataTypes.STRING, notNull: false, },
        mode: { type: DataTypes.STRING, notNull: false, },
        createTime: { type: DataTypes.STRING, notNull: false, },
        deleteTime: { type: DataTypes.STRING, notNull: false, },
    }, { operatorAliases: true, freezeTableName: true, timestamps: false });

    return contact
}

