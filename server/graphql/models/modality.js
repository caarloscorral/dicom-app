// Importing required modules
const { DataTypes } = require('sequelize');
const sequelize = require('../../db/sequelize-instance');

// Defining Modality model
const Modality = sequelize.define(
	'Modality', {
		idModality: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}
);

// Exporting Modality model
module.exports = Modality;