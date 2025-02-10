// Importing required modules
import React, { useEffect, useState } from 'react';
import { Typography, Table, TableBody,
	TableCell, TableContainer, TableHead, TableRow, Paper, Box, Divider, TextField } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { AttachFile, ErrorOutline } from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_FILES_QUERY, UPLOAD_FILE_MUTATION } from '../graphql/queries';


// Functional component for the UploadPage
function UploadPage() {
	// Setting page title
	useEffect(() => {
		document.title = 'DICOM App - Uploader';
	}, []);

	// State variables
	const [errorMessage, setErrorMessage] = useState('');

	const [filters, setFilters] = useState({
		patientId: '',
		patientName: '',
		studyDescription: '',
		studyDate: '',
		seriesName: '',
		seriesDate: '',
		modality: '',
		fileId: '',
		filePath: ''
	});

	// Query for fetching all files
	const { data, loading, error, refetch } = useQuery(GET_ALL_FILES_QUERY)

	// Mutation for uploading DICOM files
	const [uploadDicomFile] = useMutation(UPLOAD_FILE_MUTATION, {
		onCompleted: (result) => {
			console.log('Upload successful:', result);
			setErrorMessage('');

			// Refreshing data after successful upload
			refetch();
		},
		onError: (error) => {
			console.error('Error uploading file:', error);
			setErrorMessage('Error uploading file');
		}
	});

	// Configuring Dropzone for uploading files
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		// Accepting only DICOM files
		accept: {
			'application/dicom': ['.dcm']
		},

		// Limiting to single file upload
		multiple: false,

		// Use mutation to upload file on drop if accepted file
		onDropAccepted: (acceptedFiles) => {
			const file = acceptedFiles[0];
			console.log('Accepted file: ', file);
			uploadDicomFile({ variables: { file } });
			setErrorMessage('');
		},

		// Showing error message if not a DICOM file
		onDropRejected: (fileRejections) => {
			setErrorMessage('Only DICOM files with .dcm extension are allowed. Please try again.');
			console.log('Rejected file: ', fileRejections);
		},
	});

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
		const { patientId, patientName, studyDescription, studyDate, seriesName, seriesDate, modality, fileId, filePath } = filters;

		return (
			(patientId === '' || file.series.study.patient.idPatient.toString().includes(patientId)) &&
			(patientName === '' || file.series.study.patient.name.toLowerCase().includes(patientName.toLowerCase())) &&
			(studyDescription === '' || file.series.study.studyDescription.toLowerCase().includes(studyDescription.toLowerCase())) &&
			(studyDate === '' || file.series.study.createdDate.includes(studyDate)) &&
			(seriesName === '' || file.series.seriesName.toString().includes(seriesName)) &&
			(seriesDate === '' || file.series.createdDate.includes(seriesDate)) &&
			(modality === '' || file.series.modality.name.toLowerCase().includes(modality.toLowerCase())) &&
			(fileId === '' || file.idFile.toString().includes(fileId)) &&
			(filePath === '' || file.filePath.toLowerCase().includes(filePath.toLowerCase()))
		);
	});

	// Rendering UploadPage component
	return (
		<div>
			{/* File Scanner text */}
			<Typography variant="h6" align='center' sx={{ marginTop: 8 }} gutterBottom>
				File Scanner
			</Typography>

			{/* Dropzone for uploading files */}
			<Box
				{...getRootProps()}
				sx={{
					border: '2px dashed #007bff',
					padding: 5,
					textAlign: 'center',
					cursor: 'pointer',
					marginTop: 4,
					marginX: '20px',
				}}
			>
				<input {...getInputProps()} />
				<AttachFile sx={{ fontSize: 40, color: '#007bff' }} />
				<Typography variant="h6">
					{isDragActive ? "Drop the files here..." : "Drag 'n' drop some files here, or click to select files"}
				</Typography>
			</Box>

			{errorMessage && (
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
					<ErrorOutline color="error" sx={{ mr: 1 }} />
					<Typography variant="body1" align='center' color="error">
						{errorMessage}
					</Typography>
				</Box>
			)}

			{/* Horizontal line */}
			<Divider sx={{ marginY: 4 }} />

			{/* Uploaded Files text */}
			<Typography variant="h6" align='center' sx={{ marginTop: 4 }} gutterBottom>
				Uploaded Files
			</Typography>

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
									label="File Path" 
									name="filePath" 
									value={filters.filePath} 
									onChange={filterChange} 
									variant="standard" 
								/>
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
								<TableCell>{file.filePath}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

// Exporting UploadPage component
export default UploadPage;