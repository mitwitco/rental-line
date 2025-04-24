'use strict';
module.exports = (sequelize, DataTypes) => {
    const parking_grid = sequelize.define('parking_grid', {
        gridId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: false
        },
        parkId: { type: DataTypes.INTEGER, notNull: false, },
        rateId: { type: DataTypes.INTEGER, notNull: false, },
        total_place: { type: DataTypes.STRING, notNull: false, },
        park_type: { type: DataTypes.STRING, notNull: false, },
        createTime: { type: DataTypes.STRING, notNull: false, },
        updateTime: { type: DataTypes.STRING, notNull: false, },
        deleteTime: { type: DataTypes.STRING, notNull: false, },
        
       
    }, { operatorAliases: true, freezeTableName: true, timestamps: false });

    return parking_grid
}

