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

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Hot Toast for notifications
- Jest and React Testing Library for testing

### Backend
- C# .NET
- SQLite database (ephemeral for POC)
- RESTful API endpoints
- xUnit for testing

## Running the Application

### Backend

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

### Frontend

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

## Running Tests

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

## Deployment

The application is deployed to Azure and is accessible in production. CI/CD pipelines are configured to automate the deployment process:

- Any new commits to the master branch trigger the CI/CD pipeline
- Tests are automatically run as part of the pipeline
- If all tests pass, the application is automatically deployed to production

## Important Notes

- **Data Storage**: The application currently uses an ephemeral SQLite database for the proof of concept, meaning data will not persist between service restarts in production. In a real production environment, this would be replaced with a persistent database solution.

- **API Mocking**: Frontend tests use mock API responses to isolate testing from the backend, ensuring tests are reliable and not dependent on the backend state.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Merge Request
