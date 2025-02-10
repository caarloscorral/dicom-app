// Importing required modules
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, ListItemIcon, CssBaseline, Divider } from '@mui/material';
import { Home, UploadFile, FileDownload, Preview } from '@mui/icons-material';
import HomePage from './components/HomePage';
import UploadPage from './components/UploadPage';
import DownloadPage from './components/DownloadPage';
import ViewerPage from './components/ViewerPage';

// Functional component for App
function App() {
	return (
		<>
			<CssBaseline />
			<div style={{ display: 'flex' }}>
				{/* Drawer for navigation in left pane*/}
				<Drawer
					variant="permanent"
					sx={{
						width: 180,
						flexShrink: 0,
						[`& .MuiDrawer-paper`]: {
							width: 180,
							boxSizing: 'border-box',
							display: 'flex',
							flexDirection: 'column'
						},
					}}
					>
					<Toolbar />
					<List>
						{/* Link to Home page */}
						<ListItem button component={Link} to="/">
							<ListItemIcon>
								<Home />
							</ListItemIcon>
							<ListItemText primary="Home" />
						</ListItem>
						<Divider />

						{/* Link to Upload page */}
						<ListItem button component={Link} to="/uploader">
							<ListItemIcon>
								<UploadFile />
							</ListItemIcon>
							<ListItemText primary="Upload" />
						</ListItem>
						<Divider />


						{/* Link to Download page */}
						<ListItem button component={Link} to="/downloader">
							<ListItemIcon>
								<FileDownload />
							</ListItemIcon>
							<ListItemText primary="Download" />
						</ListItem>
						<Divider />

						{/* Link to Viewer page */}
						<ListItem button component={Link} to="/viewer">
							<ListItemIcon>
								<Preview />
							</ListItemIcon>
							<ListItemText primary="Viewer" />
						</ListItem>
						<Divider />
					</List>
				</Drawer>

				<main style={{ flexGrow: 1, padding: 24 }}>
					{/* App bar to show logo and title */}
					<AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
						<Toolbar>
							<img src={`${process.env.PUBLIC_URL}/DICOM_logo.png`} alt="logo" style={{ width: 60, height: 60, marginRight: 10 }} />
							<Typography variant="h5">DICOM App</Typography>
						</Toolbar>
					</AppBar>

					{/* Copyright section */}
					<Typography variant="body2" position="fixed" align='center' color="textSecondary" sx={{ marginTop: 4 }}>
						© 2025 DICOM Viewer App. All rights reserved.
					</Typography>

					{/* Routes for different pages */}
					<Routes>
						<Route path="/" element={ <HomePage/> } />
						<Route path="/uploader" element={ <UploadPage/> } />
						<Route path="/downloader" element={ <DownloadPage /> } />
						<Route path="/viewer" element={ <ViewerPage /> } />
					</Routes>
				</main>
			</div>
		</>
	);
}

// Exporting App component
export default App;