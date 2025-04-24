'use strict';
module.exports = (sequelize, DataTypes) => {
    const vehicle = sequelize.define('vehicle', {
        vehicleId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: false
        },
        userId: { type: DataTypes.INTEGER, notNull: false, },
        parkId: { type: DataTypes.INTEGER, notNull: false, },
        license_plate: { type: DataTypes.STRING, notNull: false, },
        line_messageId: { type: DataTypes.INTEGER, notNull: false, },
        createTime: { type: DataTypes.STRING, notNull: false, },
        updateTime: { type: DataTypes.STRING, notNull: false, },
        deleteTime: { type: DataTypes.STRING, notNull: false, },
    }, { operatorAliases: true, freezeTableName: true, timestamps: false });

    return vehicle
}

