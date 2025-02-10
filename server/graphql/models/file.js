// Importing required modules
const { DataTypes } = require('sequelize');
const sequelize = require('../../db/sequelize-instance');

// Defining File model
const File = sequelize.define(
	'File', {
		idFile: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		fileName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		filePath: {
			type: DataTypes.STRING,
			allowNull: false
		},
		createdDate: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		}
	}
);

// Exporting File model
module.exports = File;