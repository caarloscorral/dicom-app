// Importing required modules
const File = require('./file');
const Series = require('./series');
const Modality = require('./modality');
const Study = require('./study');
const Patient = require('./patient');

// Defining Associations
const Associations = () => {
	// File and Series relationship
	File.belongsTo(Series, { foreignKey: 'idSeries', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
	Series.hasOne(File, { foreignKey: 'seriesId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

	// Series and Modality relationship
	Series.belongsTo(Modality, { foreignKey: 'idModality', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
	Modality.hasMany(Series, { foreignKey: 'idModality', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

	// Series and Study relationship
	Series.belongsTo(Study, { foreignKey: 'idStudy', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
	Study.hasMany(Series, { foreignKey: 'idStudy', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
	
	// Study and Patient relationship
	Study.belongsTo(Patient, { foreignKey: 'idPatient', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
	Patient.hasMany(Study, { foreignKey: 'idPatient', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
};

// Exporting Associations
module.exports = Associations;