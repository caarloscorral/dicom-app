// Importing required modules
require('dotenv').config({ path: '../server.env' });
const { Sequelize } = require('sequelize');

// Loading MySQL port from .env file or setting it to default port
const PORT = process.env.MYSQL_PORT || 3306;

// Setting up connection to MySQL database with Sequelize
const sequelize = new Sequelize(
	process.env.MYSQL_DATABASE,
	process.env.MYSQL_USER,
	process.env.MYSQL_PASSWORD,
	{
		host: process.env.MYSQL_HOST,
		port: PORT,
		dialect: 'mysql',
	}
);

// Verifying connection
sequelize.authenticate()
  .then(() => {
    console.log('🛢️ Connected to MySQL database');
  })
  .catch(err => {
    console.error('❌ Error when connecting to MySQL database', err);
  });

// Exporting Sequelize instance
module.exports = sequelize;