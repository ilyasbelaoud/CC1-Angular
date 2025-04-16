# School Management System - Instructions

## Overview

This application demonstrates a School Management System built using TypeScript and various design patterns. The system manages students, courses, teachers, and school resources with a focus on modular, maintainable code.

## Design Patterns Used

1. **Singleton Pattern**: 
   - Used in `ResourceManager` to ensure a single access point for managing school resources
   - Implemented in `src/patterns/singleton/ResourceManager.ts`

2. **Factory Pattern**:
   - Used in `CourseFactory` to create different types of courses without exposing creation logic
   - Implemented in `src/patterns/factory/CourseFactory.ts`

3. **Decorator Pattern**:
   - Used to dynamically add services to students (tutoring, arts, sports)
   - Implemented in `src/patterns/services/` directory

4. **DAO Pattern**:
   - Used for data access operations with IndexedDB
   - Implemented in `src/dao/` directory

5. **Dependency Injection**:
   - Services receive their dependencies through constructors
   - Example: `StudentService` receives a `StudentDao` in its constructor

## Key Components

### Models
- `Student`: Represents a student with personal information, enrolled courses, and services
- `Teacher`: Represents a teacher with specialty information
- `Course`: Represents a course with name, teacher assignment, and other details
- `Resource`: Represents physical resources (classrooms, equipment, supplies)
- `Service`: Interface for add-on services that can be applied to students

### Services
- `StudentService`: Handles business logic for student operations
- `TutoringService`, `SportsService`, `ArtsService`: Different services that can be added to students

### Data Access Objects (DAOs)
- `StudentDao`: Manages storage and retrieval of student data in IndexedDB
- `IDao`: Interface defining common DAO methods

## Running the Application

1. Start the application:
   ```
   npm start
   ```

2. Access the application in your browser at: http://localhost:9000

3. The application will automatically:
   - Initialize the database
   - Create sample teachers, students, and courses
   - Enroll students in courses
   - Apply different services to students
   - Display all entities in the UI

## Extending the System

To add new functionality:

1. **Add new course types**:
   - Add new factory methods to `CourseFactory`

2. **Add new services**:
   - Create a new service class extending `BaseService`
   - Implement specialized logic in the `applyToStudent` method

3. **Add new resource types**:
   - Modify the `Resource` model to include new resource types
   - Use the `ResourceManager` singleton to manage them 