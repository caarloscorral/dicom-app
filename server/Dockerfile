# Using an official Node.js image as base image
FROM node:18-alpine

# Installing Python 3 and venv for running dicom-service
RUN apk add --no-cache python3 py3-pip py3-virtualenv

# Installing bash
RUN apk add --no-cache bash netcat-openbsd dos2unix

# Creating a non-root user and group
RUN addgroup -S non-root-group && adduser -S non-root-user -G non-root-group

# Setting working directory inside the Docker container
WORKDIR /app

# Copying configuration files
COPY package*.json ./

# Updating npm and installing necessary dependencies with legacy-peer-deps flag to ensure required dependencies are installed
RUN npm update && npm install --legacy-peer-deps

# Copying files to run server
COPY . ./

# Copying entrypoint.sh file
COPY entrypoint.sh ./entrypoint.sh

# Changing permissions of entrypoint.sh file
RUN chmod +x ./entrypoint.sh

# Changing line endings of entrypoint.sh file to Unix format
RUN dos2unix ./entrypoint.sh

# Copying dicom-service files
COPY dicom-service ./dicom-service

# Creating directory for file uploads if it does not exist and setting permissions
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

# Changing ownership of the application files to the non-root user
RUN chown -R non-root-user:non-root-group ./

# Switching to non-root user
USER non-root-user

# Creating a Python virtual environment and nstalling dependencies for dicom-service
RUN python3 -m venv ./venv && \
	/bin/sh -c "source ./venv/bin/activate && pip install --upgrade pip && pip install --no-cache-dir -r ./dicom-service/requirements.txt"

# Command to use entrypoint to ensure MySQL is ready
ENTRYPOINT ["./entrypoint.sh"]

# Command to start the application
CMD ["npm", "start"]