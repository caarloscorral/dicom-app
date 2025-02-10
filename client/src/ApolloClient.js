// Importing required modules
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

// Loading server port from .env file or setting it to default port
const PORT = process.env.SERVER_PORT || 5000;

// Create an upload link that will be used to send the files to the server
const uploadLink = createUploadLink({
	uri: `http://localhost:${PORT}/graphql`,
});

// Creating a new Apollo Client instance using the upload link
const client = new ApolloClient({
	link: uploadLink,
	cache: new InMemoryCache(),
});

// Exporting Apollo Client instance
export default client;