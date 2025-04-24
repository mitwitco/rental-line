'use strict';
module.exports = (sequelize, DataTypes) => {
    const company_data = sequelize.define('company_data', {
        companyId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: false
        },
        company_name: { type: DataTypes.STRING, notNull: false, },
        company_address: { type: DataTypes.STRING, notNull: false, },
        company_phone: { type: DataTypes.STRING, notNull: false, },
        tax_id: { type: DataTypes.STRING, notNull: false, },
        invoice_title: { type: DataTypes.STRING, notNull: false, },
        createTime: { type: DataTypes.STRING, notNull: false, },
        updateTime: { type: DataTypes.STRING, notNull: false, },
        deleteTime: { type: DataTypes.STRING, notNull: false, },
    }, { operatorAliases: true, freezeTableName: true, timestamps: false });

    return company_data
}

