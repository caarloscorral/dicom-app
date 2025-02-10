// Importing required modules
const { DataTypes } = require('sequelize');
const sequelize = require('../../db/sequelize-instance');

// Defining Series model
const Series = sequelize.define(
	'Series', {
		idSeries: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		seriesName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		createdDate: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		}
	}
);

// Exporting Series model
module.exports = Series;