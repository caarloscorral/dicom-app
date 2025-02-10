import gql from 'graphql-tag';

// GrapQL query for getting all files
export const GET_ALL_FILES_QUERY = gql`
	query GetAllFiles {
		getAllFiles {
			fileName
			filePath
			idFile
			series {
				idSeries
				seriesName
				createdDate
				modality {
					name
				}
				study {
					studyName
					createdDate
					patient {
						idPatient
						name
					}
				}
			}
		}
	}
`;

// GraphQL mutation for uploading DICOM files
export const UPLOAD_FILE_MUTATION = gql`
	mutation UploadDicomFile($file: Upload!) {
		uploadDicomFile(file: $file)
	}
`;