// Importing required modules
import React, { useEffect, useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Divider, TextField } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_ALL_FILES_QUERY } from '../graphql/queries';
import { Preview } from '@mui/icons-material';
import DICOMViewer from './DICOMViewer';

// Functional component for the ViewerPage
function ViewerPage() {
	// Setting page title
	useEffect(() => {
		document.title = 'DICOM App - Viewer';
	}, []);

	// Loading server port from .env file or setting it to default port
	const PORT = process.env.SERVER_PORT || 5000;

	// State variables
	const [viewingImageId, setViewingImageId] = useState(null);

	const [filters, setFilters] = useState({
		patientId: '',
		patientName: '',
		studyDescription: '',
		studyDate: '',
		seriesName: '',
		seriesDate: '',
		modality: '',
		fileId: '',
		fileName: ''
	});

	// Query for fetching all files
	const { data, loading, error } = useQuery(GET_ALL_FILES_QUERY)

	// Handling file view
	const viewFile = (fileName) => {
		// Constructing image ID for cornerstone based on filepath
		const baseURL = `http://localhost:${PORT}/uploads`;
		const imageId = `wadouri:${baseURL}/${fileName}`;

		// Showing file using image ID
		setViewingImageId(imageId);
	}

	// Handling viewer close
	const closeViewer = () => setViewingImageId(null);

	// Handling filter change
	const filterChange = (event) => {
		setFilters({
			...filters,
			[event.target.name]: event.target.value,
		});
	};

	// Setting loading and error messages
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error occurred: {error.message}</p>;

	// Getting all files using GraphQL query
	const files = data?.getAllFiles || [];
	
	// Applying filters to files
	const filteredFiles = files.filter(file => {
		const { patientId, patientName, studyDescription, studyDate, seriesName, seriesDate, modality, fileId, fileName } = filters;

		return (
			(patientId === '' || file.series.study.patient.idPatient.toString().includes(patientId)) &&
			(patientName === '' || file.series.study.patient.name.toLowerCase().includes(patientName.toLowerCase())) &&
			(studyDescription === '' || file.series.study.studyDescription.toLowerCase().includes(studyDescription.toLowerCase())) &&
			(studyDate === '' || file.series.study.createdDate.includes(studyDate)) &&
			(seriesName === '' || file.series.seriesName.toString().includes(seriesName)) &&
			(seriesDate === '' || file.series.createdDate.includes(seriesDate)) &&
			(modality === '' || file.series.modality.name.toLowerCase().includes(modality.toLowerCase())) &&
			(fileId === '' || file.idFile.toString().includes(fileId)) &&
			(fileName === '' || file.fileName.toLowerCase().includes(fileName.toLowerCase()))
		);
	});

	// Rendering ViewerPage component
	return (
		<div>

			{/* DICOM File Viewer text */}
			<Typography variant="h6" align='center' sx={{ marginTop: 12 }} gutterBottom>
				DICOM File Viewer
			</Typography>

			{/* Horizontal line */}
			<Divider sx={{ marginY: 4 }}/>

			{/* File Viewer */}
			{viewingImageId && <DICOMViewer imageId={viewingImageId} closeViewer={closeViewer} />}

			{/* Table to display uploaded files */}
			<TableContainer component={Paper} style={{ margin: '20px' }}>
				<Table>
					{/* Table columns */}
					<TableHead>
						<TableRow>
							<TableCell>
								<TextField 
									label="Patient ID" 
									name="patiendId" 
									value={filters.patientId} 
									onChange={filterChange} 
									variant="standard" 
								/>
							</TableCell>
							<TableCell>
								<TextField 
									label="Patient Name" 
									name="patientName" 
									value={filters.patientName} 
									onChange={filterChange} 
									variant="standard" 
								/>
							</TableCell>
							<TableCell>
								<TextField 
									label="Study Description" 
									name="studyDescription" 
									value={filters.studyDescription} 
									onChange={filterChange} 
									variant="standard" 
								/>
							</TableCell>
							<TableCell>
								<TextField 
									label="Study Datetime" 
									name="studyDate" 
									value={filters.studyDate} 
									onChange={filterChange} 
									variant="standard" 
								/>
							</TableCell>
							<TableCell>
								<TextField 
									label="Series Name" 
									name="seriesName" 
									value={filters.seriesName} 
									onChange={filterChange} 
									variant="standard" 
								/>
							</TableCell>
							<TableCell>
								<TextField 
									label="Series Datetime" 
									name="seriesDate" 
									value={filters.seriesDate} 
									onChange={filterChange} 
									variant="standard" 
								/>
							</TableCell>
							<TableCell>
								<TextField 
									label="Modality" 
									name="modality" 
									value={filters.modality} 
									onChange={filterChange} 
									variant="standard" 
								/>
							</TableCell>
							<TableCell>
								<TextField 
									label="File Number" 
									name="fileId" 
									value={filters.fileId} 
									onChange={filterChange} 
									variant="standard" 
								/>
							</TableCell>
							<TableCell>
								<TextField 
									label="File Name" 
									name="fileName" 
									value={filters.fileName} 
									onChange={filterChange} 
									variant="standard" 
								/>
							</TableCell>
							<TableCell>
								
							</TableCell>
						</TableRow>
					</TableHead>

					{/* Table rows filled from uploaded files data */}
					<TableBody>
						{filteredFiles.map((file) => (
							<TableRow key={file.fileName}>
								<TableCell>{file.series.study.patient.idPatient}</TableCell>
								<TableCell>{file.series.study.patient.name}</TableCell>
								<TableCell>{file.series.study.studyName}</TableCell>
								<TableCell>{file.series.study.createdDate}</TableCell>
								<TableCell>{file.series.seriesName}</TableCell>
								<TableCell>{file.series.createdDate}</TableCell>
								<TableCell>{file.series.modality.name}</TableCell>
								<TableCell>{file.idFile}</TableCell>
								<TableCell>{file.fileName}</TableCell>
								<TableCell>
									<Button
										variant="contained"
										color="primary"
										onClick={() => viewFile(file.fileName)}
										startIcon={<Preview/>}
									>
										View
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

// Exporting ViewerPage component
export default ViewerPage;