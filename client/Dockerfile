# Using an official Node.js runtime as a parent image
FROM node:18-alpine AS build

# Setting working directory
WORKDIR /app

# Installing bash
RUN apk add --no-cache bash

# Copying configuration files
COPY package*.json ./

# Updating npm and installing necessary dependencies with legacy-peer-deps flag to ensure required dependencies are installed
RUN npm update && npm install --legacy-peer-deps

# Copying files to run client
COPY . .

# Building application
RUN npm run build

# Using Nginx to serve application
FROM nginx:stable-alpine

# Setting working directory
WORKDIR /app

# Copying build output from the builder stage
COPY --from=build /app/build /usr/share/nginx/html

# Copying custom nginx configuration to serve the application
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Serving application
CMD ["nginx", "-g", "daemon off;"]