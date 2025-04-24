'use strict';
module.exports = (sequelize, DataTypes) => {
    const monthly_rent_station = sequelize.define('monthly_rent_station', {
        monthly_rent_stationId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: false
        },
        depark_id: { type: DataTypes.INTEGER, notNull: false, },
        isinvoice: { type: DataTypes.STRING, notNull: false, },
        linked: { type: DataTypes.STRING, notNull: false, },
        grace_day: { type: DataTypes.INTEGER, notNull: false, },
       
    }, { operatorAliases: true, freezeTableName: true, timestamps: false });

    return monthly_rent_station
}

