'use strict';
module.exports = (sequelize, DataTypes) => {
    const login_user = sequelize.define('login_user', {
        loginId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: false
        },
        companyId: { type: DataTypes.INTEGER, notNull: false, },
        name: { type: DataTypes.STRING, notNull: false, },
        deparkId: { type: DataTypes.STRING, notNull: false, },
        account: { type: DataTypes.STRING, notNull: false, },
        pwd: { type: DataTypes.STRING, notNull: false, },
        createTime: { type: DataTypes.STRING, notNull: false, },
        updateTime: { type: DataTypes.STRING, notNull: false, },
        deleteTime: { type: DataTypes.STRING, notNull: false, },
    }, { operatorAliases: true, freezeTableName: true, timestamps: false });

    return login_user
}

