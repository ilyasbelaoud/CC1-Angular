


# School Management System

A comprehensive TypeScript-based application for managing school resources, students, courses, and services using modern design patterns and IndexedDB for data persistence.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Design Patterns](#design-patterns)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Overview

This School Management System provides a complete solution for educational institutions to manage:
- Student enrollment and records
- Course creation and scheduling
- Teacher assignments
- Resource management (classrooms, equipment, supplies)
- Additional student services (tutoring, extracurricular activities)

## Features

- **Student Management**: Register, update, and track student information
- **Course Management**: Create different types of courses with specific requirements
- **Teacher Assignment**: Assign teachers to courses based on specialties
- **Resource Allocation**: Track and manage school resources
- **Service Add-ons**: Dynamically add services like tutoring or extracurricular activities to student profiles
- **Data Persistence**: Store all entities in IndexedDB for offline capability

## Technology Stack

- **TypeScript**: Strongly-typed JavaScript for better code quality
- **IndexedDB**: Browser-based NoSQL database for client-side storage
- **Webpack**: Module bundler for application building
- **Angular**: Frontend framework for UI components
- **RxJS**: Reactive programming library for handling asynchronous operations

## Architecture

The application follows a modular architecture with clear separation of concerns:

- **Models**: Define data structures for core entities
- **DAOs (Data Access Objects)**: Handle database operations
- **Services**: Implement business logic
- **Patterns**: Implement design patterns for specific requirements
- **UI Components**: Handle user interaction

## Design Patterns

This project showcases the following design patterns:

1. **Singleton Pattern**: 
   - Used in `ResourceManager` to ensure a single point of access for school resources

2. **Factory Pattern**:
   - Implemented in `CourseFactory` to create different course types without exposing instantiation logic

3. **Decorator Pattern**:
   - Applied to dynamically add services to student profiles without modifying existing code

4. **DAO Pattern**:
   - Used for data access abstraction with IndexedDB

5. **Dependency Injection**:
   - Used for managing dependencies between services and components

## Project Structure

```
src/
├── models/         # Data models for core entities
├── dao/            # Data Access Objects for IndexedDB operations
├── services/       # Business logic services
├── patterns/
│   ├── singleton/  # Singleton implementation
│   ├── factory/    # Factory pattern implementation
│   ├── decorator/  # Decorator pattern implementation
│   └── services/   # Service decorators
├── utils/          # Utility functions
├── app/            # Angular components
├── App.ts          # Main application class
├── index.ts        # Application entry point
├── main.ts         # Bootstrap code
└── index.html      # Main HTML template
```

## Installation

1. Clone the repository:
   ```
   git clone [repository-url]
   cd school-management-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Start the development server:
   ```
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:9000
   ```

3. For production build:
   ```
   npm run build
   ```

## Development

- **Adding a new course type**:
  1. Create a new course class extending the base Course model
  2. Add a factory method to CourseFactory

- **Adding a new service**:
  1. Create a new service class extending BaseService
  2. Implement the required methods

- **Extending data models**:
  1. Update the model class
  2. Update corresponding DAO to handle new properties

## API Documentation

### Core Models

- **Student**: Represents a student with enrollment information
- **Teacher**: Represents a teacher with subject specializations
- **Course**: Base class for all course types
- **Resource**: Represents physical resources in the school

### Key Services

- **StudentService**: Handles student registration and management
- **CourseService**: Manages course creation and scheduling
- **TeacherService**: Handles teacher assignment and management
- **ResourceManager**: Singleton for managing school resources

## Database Schema

### IndexedDB Structure
The application uses IndexedDB with the following object stores:
- `students`: Stores student records
- `teachers`: Stores teacher information
- `courses`: Stores course data
- `resources`: Stores school resource information

Each store implements versioned schema migrations for future-proofing.

## Testing

1. Run unit tests:
   ```
   npm test
   ```

2. Run end-to-end tests:
   ```
   npm run e2e
   ```

3. Generate code coverage report:
   ```
   npm run test:coverage
   ```

## Deployment

### Development Environment
```
npm run dev
```

### Production Deployment
1. Build the production bundle:
   ```
   npm run build
   ```

2. Deploy the contents of the `dist` folder to your web server

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design patterns inspired by "Design Patterns: Elements of Reusable Object-Oriented Software"
- IndexedDB implementation based on best practices from Mozilla Developer Network
- Angular architecture following official Angular documentation

