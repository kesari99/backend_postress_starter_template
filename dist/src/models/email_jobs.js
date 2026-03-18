"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class EmailJobs extends sequelize_1.Model {
    static associate(models) {
        // define association here
    }
}
exports.default = (sequelize) => {
    EmailJobs.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        queue_name: {
            type: sequelize_1.DataTypes.STRING
        },
        job_id: {
            type: sequelize_1.DataTypes.STRING,
        },
        to_address: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        subject: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        body: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.STRING(50),
            defaultValue: 'pending',
        },
        attempts: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
        max_attempts: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 3,
        },
        result: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        error: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'EmailJobs',
        tableName: 'EmailJobs',
        timestamps: false,
    });
    return EmailJobs;
};
