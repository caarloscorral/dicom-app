// Importing required modules
const fs = require('fs');
const path = require('path');
const util = require('util');
const sequelize = require('../db/sequelize-instance');
const exec = util.promisify(require('child_process').exec);
const { GraphQLScalarType, Kind } = require('graphql');
const { GraphQLUpload } = require('graphql-upload');
const Patient = require('./models/patient');
const Study = require('./models/study');
const Modality = require('./models/modality');
const Series = require('./models/series');
const File = require('./models/file');

// Defining a custom scalar for handling datetime values
const dateTimeScalar = new GraphQLScalarType({
	name: 'DateTime',
	description: 'Datetime with ISO-8601 format',

	// If GraphQL server returns a value to client and it is a Date, it is returned as is. Otherwise, it is parsed as a string
	serialize(value) {
	  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
	},

	// If client sends a variable to GraphQL server and it is a string, it is parsed as a Date. Otherwise, it is returned as null
	parseValue(value) {
		if (typeof value === 'string') {
			return new Date(value);
		}
		else if (value instanceof Date) {
			return value;
		}
		return null;
	},

	// If client sends an inline value and it is a string, it is parsed as a Date. Otherwise, it is returned as null
	parseLiteral(ast) {
	  return ast.kind === Kind.STRING ? new Date(ast.value) : null;
	}
  });


// GraphQL resolvers for managing data retrieval and mutations //
const resolvers = {
	// Adding scalar for file uploads
	Upload: GraphQLUpload,

	// Adding scalar for datetime values
	DateTime: dateTimeScalar,

	// Adding queries //
	Query: {
		// Query for retrieving a single modality by ID, including related series
		getModality: async (_, { idModality }) => {
			try {
				return await Modality.findByPk(
					idModality,
					{
						include: [
							{
								model: Series
							}
						]
					}
				);
			} catch (error) {
				console.error("🔍 Error finding modality:", error);
				throw new Error("🔍 Unable to find modality");
			}
		},

		// Query for retrieving all modalities, including related series
		getAllModalities: async () => {
			return await Modality.findAll({
				include: [
					{
						model: Series
					}
				]
			})
		},

		// Query for retrieving a single file by ID, including related series
		getFile: async (_, { idFile }) => {
			try {
				return await File.findByPk(
					idFile,
					{
						include: [
							{
								model: Series,
								include: [
									{
										model: Study,
										include: [
											{
												model: Patient
											}
										]
									},

									{
										model: Modality
									}
								]
							}
						]
					}
				);
			} catch (error) {
				console.error("🔍 Error finding file:", error);
				throw new Error("🔍 Unable to find file");
			}
		},

		// Query for retrieving all files, including related series
		getAllFiles: async () => {
			return await File.findAll({
				include: [
					{
						model: Series,
						include: [
							{
								model: Study,
								include: [
									{
										model: Patient
									}
								]
							},
							{
								model: Modality
							}
						]
					}
				]
			})
		},

		// Query for retrieving a single series by ID, including related patients, studies, modalities and files
		getSeries: async (_, {idSeries }) => {
			try {
				return await Series.findByPk(
					idSeries,
					{
						include: [
							{
								model: Study,
								include: [
									{
										model: Patient
									}
								]
							},
							{
								model: Modality
							},
							{
								model: File
							}
						]
					}
				);
			} catch (error) {
				console.error("🔍 Error finding series:", error);
				throw new Error("🔍 Unable to find series");
			}
		},

		// Query for retrieving all series, including related patients, studies, modalities and files
		getAllSeries: async () => {
			return await Series.findAll({
				include: [
					{
						model: Study,
						include: [
							{
								model: Patient
							}
						]
					},
					{
						model: File
					},
					{
						model: Modality,
					}
				]
			})
		},

		// Query for retrieving a single study by ID, including related patient and series
		getStudy: async (_, { idStudy }) => {
			try {
				return await Study.findByPk(
					idStudy,
					{
						include: [
							{
								model: Series,
								include: [
									{
										model: File
									},
									{
										model: Modality
									}
								]
							},

							{
								model: Patient
							}
						]
					}
				);
			} catch (error) {
				console.error("🔍 Error finding study:", error);
				throw new Error("🔍 Unable to find study");
			}
		},

		// Query for retrieving all studies, including related patient and series
		getAllStudies: async () => {
			return await Study.findAll({
				include: [
					{
						model: Series,
						include: [
							{
								model: File
							},
							{
								model: Modality
							}
						]
					},
					{
						model: Patient
					}	
				]
			})
		},

		// Query for retrieving a single patient by ID, including related studies
		getPatient: async (_, { idPatient }) => {
			try {
				return await Patient.findByPk(
					idPatient,
					{
						include: [
							{
								model: Study,
								include: [
									{
										model: Series,
										include: [
											{
												model: File
											},
											{
												model: Modality
											}
										]
									}
								]
							}
						]
					}
				);
			} catch (error) {
				console.error("🔍 Error finding patient:", error);
				throw new Error(" 🔍 Unable to find patient");
			}
		},

		// Query for retrieving all patients, including related studies
		getAllPatients: async () => {
			return await Patient.findAll({
				include: [
					{
						model: Study,
						include: [
							{
								model: Series,
								include: [
									{
										model: File
									},
									{
										model: Modality
									}
								]
							}
						]
					}
				]
			})
		}
	},

	// Adding mutations //
	Mutation: {
		// Mutation for adding a new patient
		addPatient: (_, { name }) => Patient.create({ name }),

		// Mutation for updating an existing patient
		updatePatient: async (_, { idPatient, ...args }) => {
			await Patient.update(args, { where: { idPatient } });
			return Patient.findByPk(idPatient);
		},

		// Mutation for deleting a patient and all related studies and series
		deletePatient: async (_, { idPatient }) => {
			const studies = await Study.findAll({ where: { idPatient } });
			await Promise.all(studies.map(study => study.destroy()));
			await Series.destroy({ where: { idPatient } });
			await Patient.destroy({ where: { idPatient } });
			return true;
		},

		// Mutation for adding a new study
		addStudy: (_, { idPatient, studyName }) => Study.create({ idPatient, studyName }),

		// Mutation for updating an existing study
		updateStudy: async (_, { idStudy, ...args }) => {
			await Study.update(args, { where: { idStudy } });
			return Study.findByPk(idStudy);
		},

		// Mutation for deleting a study and all related series
		deleteStudy: async (_, { idStudy }) => {
			await Series.destroy({ where: { idStudy } });
			await Study.destroy({ where: { idStudy } });
			return true;
		},

		// Mutation for adding a new modality
		addModality: (_, { name }) => Modality.create({ name }),

		// Mutation for updating an existing modality
		updateModality: async (_, { idModality, ...args }) => {
			await Modality.update(args, { where: { idModality } });
			return Modality.findByPk(idModality);
		},

		// Mutation for deleting a modality and all related series
		deleteModality: async (_, { idModality }) => {
			await Series.destroy({ where: { idModality } });
			await Modality.destroy({ where: { idModality } });
			return true;
		},

		// Mutation for adding a new series
		addSeries: (_, { idPatient, idStudy, idModality, seriesName }) => Series.create({ idPatient, idStudy, idModality, seriesName }),

		// Mutation for updating an existing series
		updateSeries: async (_, { idSeries, ...args }) => {
			await Series.update(args, { where: { idSeries } });
			return Series.findByPk(idSeries);
		},

		// Mutation for deleting a series and all related files
		deleteSeries: async (_, { idSeries }) => {
			await File.destroy({ where: { idSeries } });
			await Series.destroy({ where: { idSeries } });
			return true;
		},

		// Mutation for adding a new file
		addFile: (_, { idSeries, fileName, filePath }) => File.create({ idSeries, fileName, filePath }),

		// Mutation for updating an existing file
		updateFile: async (_, { idFile, ...args }) => {
			await File.update(args, { where: { idFile } });
			return File.findByPk(idFile);
		},

		// Mutation for deleting a file
		deleteFile: (_, { idFile }) => File.destroy({ where: { idFile } }).then(() => true),

		// Mutation for uploading a DICOM file
		uploadDicomFile: async (_, { file }) => {
			// Extracting file stream and filename from the file object
			const { createReadStream, filename } = await file;

			// Defining the file path to save the uploaded file
			const filePath = path.resolve(__dirname, '../uploads', filename);
			
			// Defining the path to the dicom_service script
			const scriptPath = path.join(__dirname, '../dicom-service', 'dicom_service.py');

			// Logging file path
			console.log(`${filename} will be saved to: ${filePath}`);

			// Creating a read stream from reading the file
			const stream = createReadStream();

			// Creating a write stream to save file to the uploads directory
			const out = fs.createWriteStream(filePath);

			// Logging the file upload process
			console.log(`Uploading file: ${filename} to ${filePath}`);

			// Readinng and saving file to the uploads directory
			stream.pipe(out);

			// Waiting for the file to be saved
			await new Promise((resolve, reject) => {
				// If the file is saved successfully, resolve the promise and return a success message
				out.on('finish', () => {
					console.log(`File successfully saved to: ${filePath}`);
					resolve();
				});

				// If there is an error in writing the file, reject the promise and return an error message
				out.on('error', err => {
					console.error(`Error writing file: ${err.message}`);
					reject(new Error(`Error writing file: ${err.message}`));
				});
			});

			
			// Returning DICOM data using dicom-service script
			try {
				// Executing script with file path as an argument
				const { stdout, stderr } = await exec(`python "${scriptPath}" "${filePath}"`);

				// If there is an error in the script execution, throw an error
				if (stderr) {
					console.error(`Python script execution error: ${stderr}`);
					throw new Error(`Python script execution stderr: ${stderr}`);
				}

				// Parsing the JSON output from the script
				const dicomData = JSON.parse(stdout);

				// Defining a transaction context to upload data to the database
				const transaction = await sequelize.transaction();
				try {

					// Creating database entry for Modality type if it does not exist
					const [modalityEntry] = await Modality.findOrCreate({
						where: {
							name: dicomData.Modality
						},
						transaction
					});

					// Creating database entry for Patient type if it does not exist
					const [patientEntry] = await Patient.findOrCreate({
						where: {
							name: dicomData.PatientName,
						},
						defaults: {
							createdDate: new Date()
						},
						transaction
					});

					// Creating database entry for Study type if it does not exist
					const [studyEntry] = await Study.findOrCreate({
						where: {
							studyName: dicomData.StudyDescription,
							idPatient: patientEntry.idPatient
						},
						defaults: {
							idModality: modalityEntry.idModality,
							createdDate: new Date(
								// Year, month and day from StudyDate property
								dicomData.StudyDate.substring(0, 4), dicomData.StudyDate.substring(4, 6) - 1, dicomData.StudyDate.substring(6, 8),
	
								// Hour, minute and second from StudyTime property
								dicomData.StudyTime.substring(0, 2), dicomData.StudyTime.substring(2, 4), dicomData.StudyTime.substring(4, 6)
							)
						},
						transaction
					});

					// Creating database entry for Series type if it does not exist
					const [seriesEntry] = await Series.findOrCreate({
						where: {
							seriesName: dicomData.SeriesDescription,
							idStudy: studyEntry.idStudy
						},
						defaults: {
							idModality: modalityEntry.idModality,
							idPatient: patientEntry.idPatient,
							createdDate: new Date(
								// Year, month and day from SeriesDate property
								dicomData.SeriesDate.substring(0, 4), dicomData.SeriesDate.substring(4, 6) - 1, dicomData.SeriesDate.substring(6, 8),

								// Hour, minute and second from SeriesTime property
								dicomData.SeriesTime.substring(0, 2), dicomData.SeriesTime.substring(2, 4), dicomData.SeriesTime.substring(4, 6)
							)
						},
						transaction
					});

					// Creating database entry for File type if it does not exist
					await File.findOrCreate({
						where: {
							fileName: filename,
							idSeries: seriesEntry.idSeries,
						},
						defaults: {
							filePath,
							createdDate: new Date(),
						},
						transaction
					});
					
					// Confirming transaction
					await transaction.commit();

					// Returning true if the transaction is successful
					return true;

				} catch (dbError) {
					// In case of error, rollback transaction and throw an error
					await transaction.rollback();
					console.error("Rollback database transaction due to error: ", dbError);
					throw new Error("Error in database processing.");
				}
			
			} catch (err) {
				console.error("DICOM processing failed: ", err);
				throw new Error("DICOM processing failed.");
			}
		}
	},

	// Defining relationships between models //
	// Patient model relationships
	Patient: {
		studies: (patient) => Study.findAll({ where: { idPatient: patient.idPatient } }),
	},

	// Study model relationships
	Study: {
		modality: (study) => Modality.findOne({ where: { idModality: study.idModality } }),
		patient: (study) => Patient.findOne({ where: { idPatient: study.idPatient } }),
	},

	// Series model relationships
	Series: {
		patient: (series) => Patient.findOne({ where: { idPatient: series.idPatient } }),
		study: (series) => Study.findOne({ where: { idStudy: series.idStudy } }),
		modality: (series) => Modality.findOne({ where: { idModality: series.idModality } }),
	},

	// File model relationships
	File: {
		series: (file) => Series.findOne({ where: { idSeries: file.idSeries } }),
	}
};

// Exporting resolvers
module.exports = resolvers;