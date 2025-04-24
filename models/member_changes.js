'use strict';
module.exports = (sequelize, DataTypes) => {
    const member_changes = sequelize.define('member_changes', {
        changesId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: false
        },
        userId: { type: DataTypes.INTEGER, notNull: false, },
        changed_type: { type: DataTypes.STRING, notNull: false, },
        changed_content: { type: DataTypes.STRING, notNull: false, },
        changeTime: { type: DataTypes.STRING, notNull: false, },
       
    }, { operatorAliases: true, freezeTableName: true, timestamps: false });

    return member_changes
}

