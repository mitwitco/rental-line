'use strict';
module.exports = (sequelize, DataTypes) => {
    const bill_send = sequelize.define('bill_send', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: true
        },
        farewell: { type: DataTypes.STRING, notNull: true, },
        customerId: { type: DataTypes.STRING, notNull: false, },
        cus_name: { type: DataTypes.STRING, notNull: false, },
        sendMod: { type: DataTypes.STRING, notNull: false, },
        subject: { type: DataTypes.STRING, notNull: false, },
        content: { type: DataTypes.STRING, notNull: false, },
        connectionId: { type: DataTypes.STRING, notNull: false, },
        sendTime: { type: DataTypes.STRING, notNull: false, },
        sendType: { type: DataTypes.STRING, notNull: false, },
        createTime: { type: DataTypes.STRING, notNull: false, },
    }, { operatorAliases: true, freezeTableName: true, timestamps: false });

    return bill_send
}

