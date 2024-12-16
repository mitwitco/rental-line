'use strict';
module.exports = (sequelize, DataTypes) => {
    const defnotify = sequelize.define('defnotify', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: true
        },
        createDate: { type: DataTypes.STRING, notNull: true, },
        customerId: { type: DataTypes.STRING, notNull: true, },
        cusName: { type: DataTypes.STRING, notNull: true, },
        contactId: { type: DataTypes.STRING, notNull: false, },
        sendMod: { type: DataTypes.STRING, notNull: false, },
        title: { type: DataTypes.STRING, notNull: false, },
        subject: { type: DataTypes.STRING, notNull: false, },
        content: { type: DataTypes.STRING, notNull: false, },
        connectionId: { type: DataTypes.STRING, notNull: false, },
        sendTime: { type: DataTypes.STRING, notNull: false, },
        sendType: { type: DataTypes.STRING, notNull: false, },
        createTime: { type: DataTypes.STRING, notNull: false, },
        notused: { type: DataTypes.STRING, notNull: false, },
        contract_sales: { type: DataTypes.STRING, notNull: false, },
        con_notes: { type: DataTypes.STRING, notNull: false, }
    }, { operatorAliases: true, freezeTableName: true, timestamps: false });

    return defnotify
}

