'use strict';
module.exports = (sequelize, DataTypes) => {
    const operation_record = sequelize.define('operation_record', {
        recordId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: false
        },
        userId: { type: DataTypes.INTEGER, notNull: false, },
        operation_type: { type: DataTypes.STRING, notNull: false, },
        operationTime: { type: DataTypes.STRING, notNull: false, },
   
       
    }, { operatorAliases: true, freezeTableName: true, timestamps: false });

    return operation_record
}

