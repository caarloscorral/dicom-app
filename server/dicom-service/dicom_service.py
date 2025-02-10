import sys
import json
import numpy as np
from pydicom import dcmread
from pydicom.dataset import Dataset
from pydicom.multival import MultiValue
from pydicom.valuerep import PersonName

# Function to get value from DICOM dataset
def get_dicom_value(ds: Dataset, name: str):
	"""
	Gets value from DICOM dataset and returns it in a format that can be serialized to JSON.
 
	:param ds: Dataset, DICOM dataset to extract value from
	:param name: str, name of the value to extract
	:return: str, extracted value in a format that can be serialized to JSON
	"""
	# Extracting value from dataset
	value = ds.get(name)

	# Checking if value is None and returning empty string
	if value is None:
		return ""

	# Checking if value is MultiValue and converting to list
	if isinstance(value, MultiValue):
		return np.array(value).tolist()

	# Checking if value is PersonName and converting to string
	if isinstance(value, PersonName):
		return str(value)

	# Checking if value is NumPy array and converting to list
	if isinstance(value, np.ndarray):
		return value.tolist()

	# Checking if value is float or integer and converting to primitive type
	if isinstance(value, (np.floating, np.integer)):
		return value.item()

	return value


# Function to extract data from DICOM file
def extract_dicom_data(filepath: str, all: bool=False):
	"""
	Extracts needed data from DICOM file and returns it in JSON format.
	This function is called by the server to extract data from uploaded DICOM file.

	:param filepath: srt, path to DICOM file
	:param all: bool, retrieve all data or just necessary data
	:return: str, JSON string containing extracted data
	"""
	try:
		# Extracting dataset from DICOM file
		ds = dcmread(filepath)

		# Extracting pixel data from dataset
		pixel_data = ds.pixel_array
		try:
			rescale_intercept = ds.RescaleIntercept
		except AttributeError:
			rescale_intercept = 0.0

		# Converting to float to avoid overflow or underflow losses
		pixel_data_float = pixel_data.astype(float) + rescale_intercept
		maximum = np.amax(pixel_data_float)
		minimum = np.amin(pixel_data_float)

		# Rescaling grey scale between 0-255
		pixel_data_float_scaled = np.maximum(0, pixel_data_float) / pixel_data_float.max(initial=0) * 255.0

		# Converting to uint8 ndarray
		pixel_data_uint8_scaled = np.uintc(pixel_data_float_scaled)

		# Getting pixel data from image
		if all:
			output_json = {
				'slices': [{
					'image': pixel_data_uint8_scaled.tolist(),
					'InstanceNumber': get_dicom_value(ds, 'InstanceNumber'),
					'SliceLocation': get_dicom_value(ds, 'SliceLocation'),
					'ImageOrientationPatient': get_dicom_value(ds, 'ImageOrientationPatient'),
					'ImagePositionPatient': get_dicom_value(ds, 'ImagePositionPatient')
				}],
				'width': ds.Columns,
				'height': ds.Rows,
				'minimum': float(minimum),
				'maximum': float(maximum),
				'Modality': get_dicom_value(ds, 'Modality'),
				'SeriesNumber': get_dicom_value(ds, 'SeriesNumber'),
				'SeriesDate': get_dicom_value(ds, 'SeriesDate'),
				'SeriesTime': get_dicom_value(ds, 'SeriesTime'),
				'SeriesDescription': get_dicom_value(ds, 'SeriesDescription'),
				'ProtocolName': get_dicom_value(ds, 'ProtocolName'),
				'PatientName': get_dicom_value(ds, 'PatientName'),
				'StudyDate': get_dicom_value(ds, 'StudyDate'),
				'StudyTime': get_dicom_value(ds, 'StudyTime'),
				'StudyDescription': get_dicom_value(ds, 'StudyDescription'),
				'SliceThickness': get_dicom_value(ds, 'SliceThickness'),
				'SpacingBetweenSlices': get_dicom_value(ds, 'SpacingBetweenSlices'),
				'RepetitionTime': get_dicom_value(ds, 'RepetitionTime'),
				'EchoTime': get_dicom_value(ds, 'EchoTime'),
				'ImageType': get_dicom_value(ds, 'ImageType'),
				'MagneticFieldStrength': get_dicom_value(ds, 'MagneticFieldStrength'),
				'NumberOfFrames': get_dicom_value(ds, 'NumberOfFrames'),
				'PixelSpacing': get_dicom_value(ds, 'PixelSpacing')
			}

		else:
			output_json = {
				'Modality': get_dicom_value(ds, 'Modality'),
				'SeriesNumber': get_dicom_value(ds, 'SeriesNumber'),
				'SeriesDate': get_dicom_value(ds, 'SeriesDate'),
				'SeriesTime': get_dicom_value(ds, 'SeriesTime'),
				'SeriesDescription': get_dicom_value(ds, 'SeriesDescription'),
				'PatientName': get_dicom_value(ds, 'PatientName'),
				'StudyDate': get_dicom_value(ds, 'StudyDate'),
				'StudyTime': get_dicom_value(ds, 'StudyTime'),
				'StudyDescription': get_dicom_value(ds, 'StudyDescription')
			}

		return json.dumps(output_json)

	except Exception as e:
		return json.dumps({'error': str(e)})


if __name__ == "__main__":
	print(extract_dicom_data(filepath=sys.argv[1]))
