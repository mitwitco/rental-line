'use strict';
module.exports = (sequelize, DataTypes) => {
    const line_member = sequelize.define('line_member', {
        memberId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: true
        },
        companyId: { type: DataTypes.INTEGER, notNull: false, },
        memberLineId: { type: DataTypes.STRING, notNull: false, },
        memberProfileName: { type: DataTypes.STRING, notNull: false, },
        lineAccount: { type: DataTypes.STRING, notNull: false, },
        point: { type: DataTypes.INTEGER, notNull: false, },
        memberJoinTime: { type: DataTypes.STRING, notNull: false, },
        memberBlockedTime: { type: DataTypes.STRING, notNull: false, },
        memberUpdateTime: { type: DataTypes.STRING, notNull: false, },
    }, { operatorAliases: true, freezeTableName: true, timestamps: false });

    return line_member
}

