// Importing required modules
const { DataTypes } = require('sequelize');
const sequelize = require('../../db/sequelize-instance');

// Defining Patient model
const Patient = sequelize.define(
	'Patient', {
		idPatient: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		createdDate: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		}
	}
);

// Exporting Patient model
module.exports = Patient;