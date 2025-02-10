// Importing required modules
import React, { useEffect, useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Divider, TextField } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_ALL_FILES_QUERY } from '../graphql/queries';
import GetAppIcon from '@mui/icons-material/GetApp';

// Functional component for the DownloadPage
function DownloadPage() {
	// Setting page title
	useEffect(() => {
		document.title = 'DICOM App - Downloader';
	}, []);

	// Loading server port from .env file or setting it to default port
	const PORT = process.env.SERVER_PORT || 5000;

	// State variables
	const [filters, setFilters] = useState({
		patientId: '',
		patientName: '',
		studyDescription: '',
		studyDate: '',
		seriesName: '',
		seriesDate: '',
		modality: '',
	});

	// Query for fetching all files
	const { data, loading, error } = useQuery(GET_ALL_FILES_QUERY)

	// Handling file download
	const downloadFile = (fileName, filePath) => {
		// Constructing download URL
		const downloadUrl = `http://localhost:${PORT}/download?filePath=${encodeURIComponent(filePath)}`;

		// Creating anchor element to download file
		const link = document.createElement('a');
		link.href = downloadUrl;

		// Setting download file name to original file name
		link.download = fileName;

		// Appending anchor element to body
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

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
		const { patientId, patientName, studyDescription, studyDate, seriesName, seriesDate, modality } = filters;

		return (
			(patientId === '' || file.series.study.patient.idPatient.toString().includes(patientId)) &&
			(patientName === '' || file.series.study.patient.name.toLowerCase().includes(patientName.toLowerCase())) &&
			(studyDescription === '' || file.series.study.studyDescription.toLowerCase().includes(studyDescription.toLowerCase())) &&
			(studyDate === '' || file.series.study.createdDate.includes(studyDate)) &&
			(seriesName === '' || file.series.seriesName.toString().includes(seriesName)) &&
			(seriesDate === '' || file.series.createdDate.includes(seriesDate)) &&
			(modality === '' || file.series.modality.name.toLowerCase().includes(modality.toLowerCase()))
		);
	});
	
	// Rendering DownloadPage component
	return (
		<div>

			{/* File Browser text */}
			<Typography variant="h6" align='center' sx={{ marginTop: 12 }} gutterBottom>
				File Browser
			</Typography>

			{/* Horizontal line */}
			<Divider sx={{ marginY: 4 }}/>

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
								
							</TableCell>
						</TableRow>
					</TableHead>

					{/* Table rows filled from uploaded files data */}
					<TableBody>
						{filteredFiles.map((file) => (
							<TableRow key={file.idFile}>
								<TableCell>{file.series.study.patient.idPatient}</TableCell>
								<TableCell>{file.series.study.patient.name}</TableCell>
								<TableCell>{file.series.study.studyName}</TableCell>
								<TableCell>{file.series.study.createdDate}</TableCell>
								<TableCell>{file.series.seriesName}</TableCell>
								<TableCell>{file.series.createdDate}</TableCell>
								<TableCell>{file.series.modality.name}</TableCell>
								<TableCell>
									<Button 
										variant="contained" 
										color="primary" 
										onClick={() => downloadFile(file.fileName, file.filePath)}
										startIcon={<GetAppIcon/>}
									>
										Download
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

// Exporting DownloadPage component
export default DownloadPage;