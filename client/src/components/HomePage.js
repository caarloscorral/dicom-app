// Importing required modules
import React, { useEffect } from 'react';
import { Typography, Paper, Box, Container, Grid2, Button } from '@mui/material';
import { Link } from 'react-router-dom';

// Functional component for the HomePage
function HomePage() {
	// Setting page title
	useEffect(() => {
		document.title = 'DICOM App - Home';
	}, []);

	return (
		<Container>
			{/* Welcome message */}
			<Typography variant="h2" align='center' sx={{ marginTop: 8 }} gutterBottom>
				Welcome to the DICOM App
			</Typography>

			<Typography variant="h6" align='center' gutterBottom>
				Easily manage and view your DICOM files.
			</Typography>

			<Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
				<Grid2 container spacing={8}>
					{/* First row -> Uploader and Downloader */}
					<Grid2 container spacing={4} justifyContent="center">
						{/* Uploader section */}
						<Grid2 item xs={12} sm={6} md={4}>
							<Box textAlign="center">
								<Typography variant="h5">Upload DICOM Files</Typography>
								<Typography variant="body1">
									Easily upload your DICOM files to our secure server.
								</Typography>
								<Button variant="contained" color="primary" component={Link} to="/uploader" sx={{ marginTop: 2 }}>
									Go to Upload Page
								</Button>
							</Box>
						</Grid2>

						{/* Downloader section */}
						<Grid2 item xs={12} sm={6} md={4}>
							<Box textAlign="center">
								<Typography variant="h5">Download Files</Typography>
								<Typography variant="body1">
									Download uploaded files at your convenience.
								</Typography>
								<Button variant="contained" color="primary" component={Link} to="/downloader" sx={{ marginTop: 2 }}>
									Go to Download Page
								</Button>
							</Box>
						</Grid2>
					</Grid2>

					{/* Second row -> Viewer */}
					<Grid2 container item xs={12} justifyContent="center">
						{/* Viewer section */}
						<Grid2 item>
							<Box textAlign="center" sx={{ marginTop: 4 }}>
								<Typography variant="h5">View DICOM Files</Typography>
								<Typography variant="body1">
									View your DICOM files directly in the browser.
								</Typography>
								<Button variant="contained" color="primary" component={Link} to="/viewer" sx={{ marginTop: 2 }}>
									Go to Viewer Page
								</Button>
							</Box>
						</Grid2>
					</Grid2>
				</Grid2>
			</Paper>

			{/* Copyright section
			<Typography variant="body2" align='center' color="textSecondary" sx={{ marginTop: 4 }}>
				© 2025 DICOM Viewer App. All rights reserved.
			</Typography> */}
		</Container>
	);
}

// Exporting HomePage component
export default HomePage;