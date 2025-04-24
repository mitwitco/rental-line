'use strict';
module.exports = (sequelize, DataTypes) => {
    const depark = sequelize.define('depark', {
        parkId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: false
        },
        park_name: { type: DataTypes.STRING, notNull: false, },
        companyId: { type: DataTypes.INTEGER, notNull: false, },
        park_address: { type: DataTypes.STRING, notNull: false, },
        park_phone: { type: DataTypes.STRING, notNull: false, },
        bank: { type: DataTypes.STRING, notNull: false, },
        createTime: { type: DataTypes.STRING, notNull: false, },
        updateTime: { type: DataTypes.STRING, notNull: false, },
        deleteTime: { type: DataTypes.STRING, notNull: false, },
        park_taxId: { type: DataTypes.STRING, notNull: false, },
        park_taxtitle: { type: DataTypes.STRING, notNull: false, },
        area: { type: DataTypes.STRING, notNull: false, },
        isrent: { type: DataTypes.STRING, notNull: false, },
        rent_startTime: { type: DataTypes.STRING, notNull: false, },
        rent_endTime: { type: DataTypes.STRING, notNull: false, },
        phone_pay: { type: DataTypes.STRING, notNull: false, },
        phone_startTime: { type: DataTypes.STRING, notNull: false, },
        phone_endTime: { type: DataTypes.STRING, notNull: false, },
        roadside: { type: DataTypes.STRING, notNull: false, },
        road_startTime: { type: DataTypes.STRING, notNull: false, },
        road_endTime: { type: DataTypes.STRING, notNull: false, },
    }, { operatorAliases: true, freezeTableName: true, timestamps: false });

    return depark
}

