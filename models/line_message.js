'use strict';
module.exports = (sequelize, DataTypes) => {
    const line_message = sequelize.define('line_message', {
        line_messageId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: false
        },
        memberLineId: { type: DataTypes.STRING, notNull: false, },
        memberProfileName: { type: DataTypes.STRING, notNull: false, },
        memberJoinTime: { type: DataTypes.STRING, notNull: false, },
        memberBlockedTime: { type: DataTypes.STRING, notNull: false, },
        memberUpdateTime: { type: DataTypes.STRING, notNull: false, },
      
    }, { operatorAliases: true, freezeTableName: true, timestamps: false });

    return line_message
}

