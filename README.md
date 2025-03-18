# Job Application Tracker

A full-stack web application designed to help job seekers track their job applications throughout the application process. 
Basic POC only, no authentication or data persistence.
This is intended for the purpose of demonstrating my skills and experience with .NET, React, CI/CD and Azure cloud services.

## Features

- Create and manage job application entries
- Track application status (Applied, Interview, Offer, Rejected)
- Update status as the application progresses
- Delete applications that are no longer relevant
- Simple and intuitive user interface
- Responsive layout working well in mobile too. 
- The most recent applications show at the top of the list. So, when we add a new application it's not hidden in the last page.  
- There's a link in the front end to the API documentation. This wouldn't normally be available in production. It's only there for the purpose of this demo.

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Hot Toast for notifications
- Jest and React Testing Library for testing

### Backend
- C# .NET
- Entity Framework Core InMemory (for POC)
- RESTful API endpoints
- xUnit for testing

## Development Workflow

This project offers multiple ways to run and test the application. You can run components together locally for development convenience, or separately to simulate the production environment.

### Command Reference

All commands should be run from the root directory of the project.

#### Installation

```bash
# Install all dependencies (frontend and backend)
npm run install:all

# Install just the root dependencies (if you've already set up projects separately)
npm install
```

#### Running the Application

```bash
# Run both frontend and backend concurrently (development mode)
npm start

# Run just the frontend
npm run start:frontend

# Run just the backend
npm run start:backend
```

#### Testing

```bash
# Run all tests (frontend and backend) concurrently
npm test

# Run just the frontend tests
npm run test:frontend

# Run just the backend tests
npm run test:backend
```

#### Access Points

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- API Documentation (Swagger UI): http://localhost:8080/swagger

### Development vs Production

- **Development (Local)**: Running the application with `npm start` launches both frontend and backend concurrently, which is convenient for development. Changes to code can be seen in real-time.

- **Production**: In the production environment, the frontend and backend are deployed as separate services. This separation allows for independent scaling, maintenance, and updates. The CI/CD pipeline handles the deployment of both services separately.

### Component-Specific Instructions

If you need to work on just one component or need more detailed instructions, follow the guides below:

#### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Restore dependencies:
   ```
   dotnet restore
   ```

3. Run the .NET application:
   ```
   dotnet run
   ```
   
   The backend API will be available at http://localhost:5000/api

#### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the React application:
   ```
   npm start
   ```
   
   The application will be available at http://localhost:3000

## Testing Details

### Backend Tests

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Run tests with .NET test runner:
   ```
   dotnet test
   ```

### Frontend Tests

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Run all tests:
   ```
   npm test
   ```
   
   This will run both unit tests and integration tests. The frontend tests use mocks to simulate the backend API.

## API Documentation

The application includes Swagger UI for API documentation and testing. You can access the Swagger UI in two ways:

1. **Directly from the browser**: Visit http://localhost:5000/swagger when the backend is running.

2. **From the frontend application**: Click the "API Documentation" link below the main title.

Swagger UI provides:
- A comprehensive list of all available API endpoints
- Request and response schemas for each endpoint
- The ability to test API calls directly from the browser
- Documentation on required parameters and authentication

This is particularly useful for frontend developers who need to understand the API capabilities, as well as for debugging purposes during development.

## Deployment

The application is deployed to Azure and is accessible in production. CI/CD pipelines are configured to automate the deployment process:

- Any new commits to the master branch trigger the CI/CD pipeline
- Tests are automatically run as part of the pipeline
- If all tests pass, the application is automatically deployed to production

## Important Notes

- **Data Storage**: The application currently uses an ephemeral database for the proof of concept, meaning data will not persist between service restarts in production. In a real production environment, this would be replaced with a persistent database solution.

- **API Mocking**: Frontend tests use mock API responses to isolate testing from the backend, ensuring tests are reliable and not dependent on the backend state.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Merge Request
