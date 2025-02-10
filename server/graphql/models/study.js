// Importing required modules
const { DataTypes } = require('sequelize');
const sequelize = require('../../db/sequelize-instance');

// Defining Study model
const Study = sequelize.define(
	'Study', {
		idStudy: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		studyName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		createdDate: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		}
	}
);

// Exporting Study model
module.exports = Study;