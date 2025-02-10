# DICOM App

This project is a web application designed for uploading, viewing, and downloading DICOM files. The application leverages a full-stack architecture with a React front-end, an Express server powered by an Apollo GraphQL API, and a MySQL database.

## Features

- **Upload:** Users can upload DICOM files to a secure server.
- **Download:** Users can download stored files for offline viewing or processing.
- **View:** Uploaded DICOM files can be viewed directly in the browser using versatile viewing tools.

## Prerequisites

- **Python 3.7+:** Make sure Python is installed on your system as it is needed to extract data from DICOM file.
- **Docker & Docker Compose:** Make sure Docker and Docker Compose are installed on your system.
- **Node.js and npm:** Required for front-end development.
- **.env Configuration:** Make sure the `server.env` and `client.env` files are correctly configured for your environment.

## Configuration

### Environment Variables

1. **Server Configuration (`server/server.env`):**
   ```plaintext
   SERVER_PORT=5000

   MYSQL_ROOT_PASSWORD=rootpassword
   MYSQL_DATABASE=dicom-db
   MYSQL_USER=myuser
   MYSQL_PASSWORD=password
   MYSQL_HOST=mysql
   MYSQL_PORT=3306

   NODE_ENV=development
   ```

2. **Client Configuration (`client/client.env`):**
   ```plaintext
   SERVER_PORT=5000
   ```

### Docker Compose Ports

The `docker-compose.yml` file is configured to run three services: MySQL, Server, and Client. Each service has its own port mapping, which can be modified as needed:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    restart: always
    ports:
      - "3307:3306"  # Change 3307 to your desired host port if needed
    env_file:
      - ./server/server.env
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - app-network

  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "5000:5000"  # Change 5000 to your preferred host port for the server
    volumes:
      - ./server/uploads:/uploads
    env_file:
      - ./server/server.env
    depends_on:
      - mysql
    networks:
      - app-network

  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "3000:80"    # Use a different host port instead of 3000 if necessary
    networks:
      - app-network
    depends_on:
      - mysql
      - server

networks:
  app-network:
    driver: bridge

volumes:
  mysql_data:
```

To change the host ports, modify the values before the colon. For example, changing `"3307:3306"` to `"your-desired-port:3306"` for the MySQL service.

## Running the Application

1. **Clone this repository:**
   ```bash
   git clone https://github.com/caarloscorral/dicom-app.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd dicom-app
   ```

3. **Building the application:**

   To build and run the app, use Docker Compose:

   ```bash
   docker-compose up --build
   ```

   This will start all services in the `docker-compose.yml` file.

4. **Accessing the application:**

   - **Client application:** Open a web browser and navigate to `http://localhost:3000` or the host port you configured for the client service.
   - **Server with GraphQL:** Reachable at `http://localhost:5000/graphql`.
   - **Download DICOM Files:** Access via `http://localhost:5000/download/<filename>`.

## Code Components

- **Server:** Handles file uploads/downloads and provides a GraphQL API for DICOM data operations.
- **Client:** A React-based user interface that interacts with the server to upload/view/download files.
- **DICOM Service (Python):** Processes and extracts data from DICOM files using `pydicom` and `numpy`.

## Notes

- Ensure proper permissions and network/firewall settings for accessing the MySQL and server endpoints.
- Verify that Docker has access to enough memory and resources to run the database services smoothly.

## Contributions

Contributions are welcome. Please open a Pull Request to suggest changes or improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/caarloscorral/dicom-app/blob/main/LICENSE) file for details.