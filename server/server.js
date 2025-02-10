// Importing required modules
require('dotenv').config({ path: './server.env' });
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const sequelize = require('./db/sequelize-instance');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

// Loading server port from .env file or setting it to default port
const PORT = process.env.SERVER_PORT || 5000;

// Database sync options based on environment
// Dropping all tables and recreating them if the environment is not prod4uction
const syncOptions = process.env.NODE_ENV === 'production' ? {} : { force: true };

// Importing and defining models and associations
const defineModels = () => {
	require('./graphql/models/file');
	require('./graphql/models/series');
	require('./graphql/models/modality');
	require('./graphql/models/patient');
	require('./graphql/models/study');
	require('./graphql/models/associations')();
};

defineModels();

(async () => {

	// Creating uploads directory if it doesn't exist
	const uploadDir = path.join(__dirname, 'uploads');
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true });
	}

	// Initializing Express application
	const app = express();

	// Enabling CORS for all routes
	app.use(cors({
		origin: '*',
		methods: ['GET', 'POST']
	}));

	// Serving static files from uploads
	app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

	// API endpoint to handle file downloads
	app.get('/download', (req, res) => {
		try {
			const { filePath } = req.query;

			// Ensuring filePath is specified
			if (!filePath) {
				return res.status(400).send('File path is required');
			}

			// Getting file absolute path
			const absolutePath = path.resolve(uploadDir, filePath);

			// Checking if file exists
			fs.access(absolutePath, fs.constants.F_OK, (err) => {
				// Sending 404 response if file doesn't exist
				if (err) {
					console.error('File not found: ', err);
					return res.status(404).send('File not found');
				}

				// Sending file for download if it exists
				res.download(absolutePath, (downloadErr) => {
					// Sending 500 response if error occurs during download
					if (downloadErr) {
						console.error(`Error downloading file ${absolutePath}: `, downloadErr);
						res.status(500).send('Error downloading file');
					}
				});
			});
		} catch (err) {
			console.error('Download error:', err);
			res.status(400).send('Invalid request');
		}
	});

	// Initializing Apollo Server and applying middleware to Express
	const server = new ApolloServer({
		typeDefs,
		resolvers
	});

	// Starting Apollo Server
	await server.start();

	// Adding middleware for handling file uploads
	app.use(graphqlUploadExpress({ maxFiles: 1 }));

	// Applying Apollo Server middleware to Express
	server.applyMiddleware({ app, path: '/graphql' });

	// Starting Express server once the database is ready
	try	{
		// Synchronizing database
		await sequelize.sync(syncOptions);
		
		// Starting Express server
		app.listen(PORT, () =>
			console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
		);
	
	// Catching errors during database synchronization
	} catch (error) {
		console.error('❌ Cannot synchronize database:', error);
	}
})();