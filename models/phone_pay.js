'use strict';
module.exports = (sequelize, DataTypes) => {
    const phone_pay = sequelize.define('phone_pay', {
        phone_payId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: false
        },
        parkId: { type: DataTypes.INTEGER, notNull: false, },
      
        
       
    }, { operatorAliases: true, freezeTableName: true, timestamps: false });

    return phone_pay
}

