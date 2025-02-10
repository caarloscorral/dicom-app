// Importing required modules
import React, { useEffect, useRef } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import Hammer from 'hammerjs';

// Setting external configuration
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneTools.external.Hammer = Hammer;

// Ensuring SUPPORT_POINTER_EVENTS is managed, as touchEventListeners.js is raising an error when trying to find SUPPORT_POINTER_EVENTS
const SUPPORT_POINTER_EVENTS = 'PointerEvent' in window;
cornerstoneTools.external.SUPPORT_POINTER_EVENTS = SUPPORT_POINTER_EVENTS;

// Initializing Cornerstone tools
cornerstoneTools.external.cornerstone = cornerstone;

// Initializing cornerstone tools with required configurations
cornerstoneTools.init({
	showSVGCursors: true,
	SUPPORT_POINTER_EVENTS
});

// Functional component for DICOMViewer
function DICOMViewer({ imageId, closeViewer }) {
	// Initializing empty viewer
	const viewerRef = useRef(null);

	// Fulling viewer with DICOM image
	useEffect(() => {
		async function initCornerstone() {
			if (viewerRef.current) {
				try {
					// Enable DOM element for cornerstone
					cornerstone.enable(viewerRef.current);

					// Loading DICOM image
					const image = await cornerstone.loadImage(imageId);

					// Displaying DICOM image
					cornerstone.displayImage(viewerRef.current, image);

					// Adding and activating tools
					cornerstoneTools.addTool(cornerstoneTools.PanTool);
					cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 2 });

					cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
					cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 4 });

					cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
					cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
				} catch (error) {
					console.error('Error loading DICOM image:', error);
				}
			}
		}

		// Initializing Cornerstone
		initCornerstone();

		// Cleaning up
		return () => {
			if (viewerRef.current) {
				cornerstone.disable(viewerRef.current);
			}
		};
	}, [imageId]);

	// Rendering DICOMViewer component
	return (
		<div>
			{/* Button to close viewer */}
			<button onClick={closeViewer}>Close Viewer</button>

			{/* Viewer window */}
			<div
				ref={viewerRef}
				style={{
					width: '80vw',
					height: '80vh',
					backgroundColor: 'black',
					margin: 'auto',
					display: 'block'
				}}
			/>
		</div>
	);
}

// Exporting DICOMViewer component
export default DICOMViewer;