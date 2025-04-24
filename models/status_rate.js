'use strict';
module.exports = (sequelize, DataTypes) => {
    const status_rate = sequelize.define('status_rate', {
        rateId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: false
        },
        parkId: { type: DataTypes.INTEGER, notNull: false, },
        identity: { type: DataTypes.STRING, notNull: false, },
        rate_name: { type: DataTypes.STRING, notNull: false, },
        car_type: { type: DataTypes.STRING, notNull: false, },
        start_time: { type: DataTypes.STRING, notNull: false, },
        stop_time: { type: DataTypes.STRING, notNull: false, },
        isholiday: { type: DataTypes.STRING, notNull: false, },
        holiday_start_time: { type: DataTypes.STRING, notNull: false, },
        holiday_stop_time: { type: DataTypes.STRING, notNull: false, },
        deposit: { type: DataTypes.STRING, notNull: false, },
        monthly_rent: { type: DataTypes.INTEGER, notNull: false, },
        bimonthly_rent: { type: DataTypes.INTEGER, notNull: false, },
        quarterly_rent: { type: DataTypes.INTEGER, notNull: false, },
        halfyear_rent: { type: DataTypes.INTEGER, notNull: false, },
        payment_method: { type: DataTypes.INTEGER, notNull: false, },
        account_opening: { type: DataTypes.STRING, notNull: false, },
        rate_notes: { type: DataTypes.STRING, notNull: false, },
        createTime: { type: DataTypes.STRING, notNull: false, },
        updateTime: { type: DataTypes.STRING, notNull: false, },
        deleteTime: { type: DataTypes.STRING, notNull: false, },
        front_display: { type: DataTypes.STRING, notNull: false, },
        front_note: { type: DataTypes.STRING, notNull: false, },
   
       
    }, { operatorAliases: true, freezeTableName: true, timestamps: false });

    return status_rate
}

