// Importing required modules
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import App from './App';
import client from './ApolloClient';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

// Creating root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendering App component inside ApolloProvider and Router
root.render(
	<ApolloProvider client={client}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ApolloProvider>
);

// Measuring performance
reportWebVitals();