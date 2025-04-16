# CC1-Angular - School Management System

## Description

This project is a School Management System built using Angular 19 and TypeScript. It demonstrates the implementation of various design patterns to create a modular, maintainable, and extensible application for managing educational institutions.

The system provides comprehensive functionality for managing students, teachers, courses, classrooms, grades, and school resources through a well-structured architecture.

## Features

### Core Functionality
- **Student Management**: Registration, course enrollment, service subscription
- **Teacher Management**: Profile creation, specialty assignment, course assignment
- **Course Management**: Different course types with dedicated teachers
- **Resource Management**: Tracking and allocation of school resources (classrooms, equipment, supplies)
- **Grade Tracking**: Recording and retrieving student grades
- **Classroom Management**: Scheduling and assignment

### Additional Services
- **Tutoring Services**: Extra academic support for specific subjects
- **Sports Services**: Athletic activities and programs
- **Arts Services**: Creative and cultural activities

## Architecture & Design Patterns

### 1. Singleton Pattern
- **Implementation**: `ResourceManager` in `src/patterns/singleton/ResourceManager.ts`
- **Purpose**: Ensures a single access point for managing school resources
- **Key Methods**:
  - `getInstance()`: Returns the singleton instance
  - `addResource()`, `allocateResource()`, `releaseResource()`: Resource management operations

### 2. Factory Pattern
- **Implementation**: `CourseFactory` in `src/patterns/factory/CourseFactory.ts`
- **Purpose**: Creates different types of courses without exposing creation logic
- **Available Course Types**:
  - Mathematics, Science, History, Language, Art, Physical Education

### 3. Decorator Pattern
- **Implementation**: `TutoringDecorator`, `SportsDecorator`, `ArtsDecorator` in `src/patterns/decorator/`
- **Purpose**: Dynamically adds services to students
- **Key Methods**:
  - `applyService()`: Adds a service to a student
  - `removeService()`: Removes a service from a student

### 4. DAO (Data Access Object) Pattern
- **Implementation**: Various DAO classes in `src/dao/`
- **Components**:
  - `StudentDao`: Manages student data
  - `TeacherDao`: Manages teacher data
  - `CourseDao`: Manages course data
  - `ResourceDao`: Manages resource data
  - `GradeDao`: Manages grade data
  - `ClassroomDao`: Manages classroom data
- **Interface**: `IDao` defining common CRUD operations

### 5. Dependency Injection
- **Implementation**: Services receive dependencies through constructors
- **Example**: `StudentService` receives `StudentDao` in its constructor

## Data Models

### Core Entities
- **Student**: Represents a student with personal information, enrolled courses, and services
  - Properties: id, name, enrolledCourses, services
  
- **Teacher**: Represents a teacher with specialty information
  - Properties: id, name, specialization
  
- **Course**: Represents a course with name and teacher assignment
  - Properties: id, name, teacher
  
- **Resource**: Represents physical resources
  - Properties: id, name, type, quantity
  
- **Grade**: Represents student performance in courses
  - Properties: id, studentId, courseId, value, date
  
- **Classroom**: Represents physical learning spaces
  - Properties: id, name, capacity, teacherId

### Service Layer
- **StudentService**: Handles business logic for student operations
- **TeacherService**: Manages teacher-related operations
- **CourseService**: Handles course creation and management
- **GradeService**: Manages grade recording and retrieval
- **ClassroomService**: Handles classroom allocation and management

## Technology Stack

- **Frontend Framework**: Angular 19
- **Language**: TypeScript
- **State Management**: RxJS
- **Storage**: IndexedDB (for local persistence)
- **Build Tools**: Webpack
- **Development Server**: Webpack Dev Server

Structuration :
cc_angular/
├── src/
│ ├── app/ # Angular components
│ │ ├── components/ # Reusable UI components
│ │ ├── students/ # Student-related components
│ │ ├── teachers/ # Teacher-related components
│ │ ├── courses/ # Course-related components
│ │ ├── classrooms/ # Classroom-related components
│ │ ├── grades/ # Grade-related components
│ │ ├── services/ # Service components
│ │ ├── dashboard/ # Main dashboard
│ │ └── app.component.ts # Root component
│ ├── models/ # Data models
│ │ ├── Student.ts
│ │ ├── Teacher.ts
│ │ ├── Course.ts
│ │ ├── Resource.ts
│ │ ├── Grade.ts
│ │ ├── Classroom.ts
│ │ ├── Service.ts
│ │ └── Entity.ts
│ ├── dao/ # Data Access Objects
│ │ ├── IDao.ts # DAO interface
│ │ ├── StudentDao.ts
│ │ ├── TeacherDao.ts
│ │ ├── CourseDao.ts
│ │ ├── ResourceDao.ts
│ │ ├── GradeDao.ts
│ │ └── ClassroomDao.ts
│ ├── patterns/ # Design pattern implementations
│ │ ├── singleton/ # Singleton pattern
│ │ ├── factory/ # Factory pattern
│ │ ├── decorator/ # Decorator pattern
│ │ └── services/ # Service classes
│ ├── utils/ # Utility functions
│ │ └── IndexedDBHelper.ts # Database helper
│ ├── App.ts # Main application class
│ ├── index.html # Entry HTML
│ └── main.ts # Entry point
├── public/ # Static assets
├── dist/ # Build output
├── package.json # Dependencies and scripts
├── tsconfig.json # TypeScript configuration
└── webpack.config.js # Webpack configuration
Apply to README.md





## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/CC1-Angular.git
   cd CC1-Angular
   ```

2. Install dependencies:
   ```
   cd cc_angular
   npm install
   ```

## Running the Application

1. Development server with hot-reloading:
   ```
   npm run dev
   ```

2. Build for production:
   ```
   npm run build
   ```

3. Start the application:
   ```
   npm start
   ```

4. Access the application in your browser at: http://localhost:9000

## Project Structure

- `src/models/`: Contains data models (Student, Teacher, Course, Resource)
- `src/services/`: Business logic services
- `src/dao/`: Data Access Objects for database operations
- `src/patterns/`: Implementation of design patterns
- `src/app/`: Angular components and modules
- `src/utils/`: Utility functions and helpers

## Extending the System

- Add new course types through the CourseFactory
- Create new services by extending BaseService
- Add resource types by modifying the Resource model

## License

ISC