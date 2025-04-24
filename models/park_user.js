'use strict';
module.exports = (sequelize, DataTypes) => {
    const park_user = sequelize.define('park_user', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: false
        },
        parkId: { type: DataTypes.INTEGER, notNull: false, },
        rateId: { type: DataTypes.INTEGER, notNull: false, },
        contract_status: { type: DataTypes.STRING, notNull: false, },
        name: { type: DataTypes.STRING, notNull: false, },
        phone_number: { type: DataTypes.STRING, notNull: false, },
        mail: { type: DataTypes.STRING, notNull: false, },
        address: { type: DataTypes.STRING, notNull: false, },
        tax_id: { type: DataTypes.STRING, notNull: false, },
        invoice_title: { type: DataTypes.STRING, notNull: false, },
        virtual_account: { type: DataTypes.STRING, notNull: false, },
        contract_start_date: { type: DataTypes.STRING, notNull: false, },
        contract_end_date: { type: DataTypes.STRING, notNull: false, },
        notes: { type: DataTypes.STRING, notNull: false, },
        createTime: { type: DataTypes.STRING, notNull: false, },
        updateTime: { type: DataTypes.STRING, notNull: false, },
        deleteTime: { type: DataTypes.STRING, notNull: false, },
        phone_carrier: { type: DataTypes.STRING, notNull: false, },
        acc_deposit: { type: DataTypes.INTEGER, notNull: false, },
        acc_deposit_count: { type: DataTypes.STRING, notNull: false, },
       
    }, { operatorAliases: true, freezeTableName: true, timestamps: false });

    return park_user
}

