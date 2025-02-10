// Importing required modules
const { gql } = require('apollo-server-express');

// Defining GraphQL types and operations
const typeDefs = gql`
	# Defining custom scalar for handling datetime values
	scalar DateTime

	# Defining custom scalar for handling file uploads
	scalar Upload

	# Defining type for modality data
	type Modality {
		idModality: ID!
		name: String!
		series: [Series]
	}

	# Defining type for file data
	type File {
		idFile: ID!
		fileName: String!
		filePath: String!
		createdDate: DateTime!
		series: Series
	}

	# Defining type for series data
	type Series {
		idSeries: ID!
		seriesName: String!
		createdDate: DateTime!
		file: [File]
		study: Study
		modality: Modality
		patient: Patient
	}

	# Defining type for study data
	type Study {
		idStudy: ID!
		studyName: String!
		createdDate: DateTime!
		series: [Series]
		patient: Patient
		modality: Modality
	}

	# Defining type for patient data
	type Patient {
		idPatient: ID!
		name: String!
		createdDate: DateTime!
		studies: [Study]
	}

	## Defining queries ##
	type Query {
		# Query for fetching modality data individually by ID or all at once
		getModality(idModality: ID!): Modality
		getAllModalities: [Modality]

		# Query for fetching file data individually by ID or all at once
		getFile(idFile: ID!): File
		getAllFiles: [File]

		# Query for fetching series data individually by ID or all at once
		getSeries(idSeries: ID!): Series
		getAllSeries: [Series]
		
		# Query for fetching study data individually by ID or all at once
		getStudy(idStudy: ID!): Study
		getAllStudies: [Study]

		# Query for fetching patient data individually by ID or all at once
		getPatient(idPatient: ID!): Patient
		getAllPatients: [Patient]
	}

	## Defining mutations ##
	type Mutation {
		# Mutation for uploading DICOM files
		uploadDicomFile(file: Upload!): Boolean
		
		# Mutations for adding, updating, and deleting patient data
		addPatient(name: String!): Patient
		updatePatient(idPatient: ID!, name: String, createdDate: DateTime): Patient
		deletePatient(idPatient: ID!): Patient

		# Mutations for adding, updating, and deleting study data
		addStudy(idPatient: ID!, studyName: String!): Study
		updateStudy(idStudy: ID!, studyName: String, createdDate: DateTime): Study
		deleteStudy(idStudy: ID!): Study

		# Mutations for adding, updating, and deleting modality data
		addModality(name: String!): Modality
		updateModality(idModality: ID!, name: String): Modality
		deleteModality(idModality: ID!): Modality

		# Mutations for adding, updating, and deleting series data
		addSeries(idPatient: ID!, idStudy: ID!, idModality: ID!, seriesName: String!): Series
		updateSeries(idSeries: ID!, seriesName: String, createdDate: DateTime): Series
		deleteSeries(idSeries: ID!): Series

		# Mutations for adding, updating, and deleting file data
		addFile(idSeries: ID!, fileName: String!, filePath: String!): File
		updateFile(idFile: ID!, fileName: String, filePath: String, createdDate: DateTime): File
		deleteFile(idFile: ID!): File
	}
`;

// Exporting type definitions
module.exports = typeDefs;