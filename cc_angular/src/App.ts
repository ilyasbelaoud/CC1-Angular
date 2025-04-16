import { StudentDao } from "./dao/StudentDao";
import { TeacherDao } from "./dao/TeacherDao";
import { CourseDao } from "./dao/CourseDao";
import { ResourceDao } from "./dao/ResourceDao";
import { StudentService } from "./patterns/services/StudentService";
import { TeacherService } from "./patterns/services/TeacherService";
import { CourseService } from "./patterns/services/CourseService";
import { CourseFactory } from "./patterns/factory/CourseFactory";
import { ResourceManager } from "./patterns/singleton/ResourceManager";
import { IndexedDBHelper } from "./utils/IndexedDBHelper";
import { TutoringService } from "./patterns/services/TutoringService";
import { SportsService } from "./patterns/services/SportsService";
import { ArtsService } from "./patterns/services/ArtsService";
import { Student } from "./models/Student";
import { Teacher } from "./models/Teacher";
import { Resource } from "./models/Resource";
import { Course } from "./models/Course";
import { TutoringDecorator } from "./patterns/decorator/TutoringDecorator";
import { GradeDao } from "./dao/GradeDao";
import { ClassroomDao } from "./dao/ClassroomDao";
import { GradeService } from "./patterns/services/GradeService";
import { ClassroomService } from "./patterns/services/ClassroomService";

export class App {
  // DAOs
  private studentDao: StudentDao;
  private teacherDao: TeacherDao;
  private courseDao: CourseDao;
  private resourceDao: ResourceDao;
  
  // Services
  private studentService: StudentService;
  private teacherService: TeacherService;
  private courseService: CourseService;
  
  // Singleton
  private resourceManager: ResourceManager;
  
  // UI Elements
  private logElement: HTMLElement | null;
  private statusElement: HTMLElement | null;
  private studentsListElement: HTMLElement | null;
  private coursesListElement: HTMLElement | null;
  private resourcesListElement: HTMLElement | null;
  private teachersListElement: HTMLElement | null;

  // New dependencies
  private gradeDao: GradeDao;
  private classroomDao: ClassroomDao;
  private gradeService: GradeService;
  private classroomService: ClassroomService;

  constructor() {
    // Get UI elements
    this.logElement = document.getElementById('log');
    this.statusElement = document.getElementById('status');
    this.studentsListElement = document.getElementById('students-list');
    this.coursesListElement = document.getElementById('courses-list');
    this.resourcesListElement = document.getElementById('resources-list');
    this.teachersListElement = document.getElementById('teachers-list');
    
    this.log("Initializing School Management System...");
    
    // Initialize DAOs
    this.studentDao = new StudentDao();
    this.teacherDao = new TeacherDao();
    this.courseDao = new CourseDao(this.teacherDao);
    this.resourceDao = new ResourceDao();
    
    // Initialize services with dependency injection
    this.studentService = new StudentService(this.studentDao);
    this.courseService = new CourseService(this.courseDao);
    this.teacherService = new TeacherService(this.teacherDao, this.courseService);
    
    // Get singleton instance of ResourceManager
    this.resourceManager = ResourceManager.getInstance();

    // Initialize new dependencies
    this.gradeDao = new GradeDao(this.studentDao, this.courseDao);
    this.classroomDao = new ClassroomDao(this.teacherDao);
    this.gradeService = new GradeService(this.gradeDao);
    this.classroomService = new ClassroomService(this.classroomDao);
  }

  async init(): Promise<void> {
    try {
      // Initialize database - await this operation
      this.log("Initializing database...");
      await IndexedDBHelper.initDatabase();
      this.log("Database initialized");
      return Promise.resolve();
    } catch (error) {
      this.logError("Error initializing database:", error);
      return Promise.reject(error);
    }
  }

  async start(): Promise<void> {
    try {
      this.updateStatus("Creating entities...");
      
      // Example: Create teachers
      const mathTeacher = new Teacher(1, "John Smith", "Mathematics");
      const scienceTeacher = new Teacher(2, "Emily Johnson", "Science");
      const historyTeacher = new Teacher(3, "Michael Brown", "History");
      
      // Register teachers
      await this.teacherService.registerTeacher(mathTeacher);
      await this.teacherService.registerTeacher(scienceTeacher);
      await this.teacherService.registerTeacher(historyTeacher);
      
      // Use Factory to create courses
      const mathCourse = CourseFactory.createMathCourse(1, mathTeacher);
      const scienceCourse = CourseFactory.createScienceCourse(2, scienceTeacher);
      const historyCourse = CourseFactory.createHistoryCourse(3, historyTeacher);
      
      // Create courses
      await this.courseService.createCourse(mathCourse);
      await this.courseService.createCourse(scienceCourse);
      await this.courseService.createCourse(historyCourse);
      
      // Display courses in UI
      const allCourses = await this.courseService.getAllCourses();
      this.displayCourses(allCourses);
      
      // Display teachers
      const allTeachers = await this.teacherService.getAllTeachers();
      this.displayTeachers(allTeachers);
      
      // Create students
      const student1 = new Student(1, "Alice Johnson");
      const student2 = new Student(2, "Bob Smith");
      const student3 = new Student(3, "Claire Williams");
      
      // Register the students
      await this.studentService.registerStudent(student1);
      await this.studentService.registerStudent(student2);
      await this.studentService.registerStudent(student3);
      
      // Enroll students in courses
      await this.studentService.enrollStudentInCourse(student1.id, mathCourse);
      await this.studentService.enrollStudentInCourse(student1.id, scienceCourse);
      await this.studentService.enrollStudentInCourse(student2.id, mathCourse);
      await this.studentService.enrollStudentInCourse(student3.id, historyCourse);
      
      // Create services
      const tutoringService = new TutoringService(1, "Mathematics", 10);
      const sportsService = new SportsService(2, "Basketball", 20);
      const artsService = new ArtsService(3, "Painting", "Beginner");
      
      // Apply services using decorator pattern
      const student1WithTutoring = new TutoringDecorator(student1, tutoringService);
      student1WithTutoring.applyService();
      
      await this.studentService.addServiceToStudent(student2.id, sportsService);
      await this.studentService.addServiceToStudent(student3.id, artsService);
      
      // Retrieve and display students
      const students = await this.studentService.getAllStudents();
      this.displayStudents(students);
      
      // Add resources (using Singleton)
      const room101 = new Resource(1, "Room 101", "classroom");
      const room102 = new Resource(2, "Room 102", "classroom");
      const projectors = new Resource(3, "Projector", "equipment", 5);
      const laptops = new Resource(4, "Laptops", "equipment", 20);
      const textbooks = new Resource(5, "Textbooks", "supplies", 30);
      
      // Add resources to both the ResourceManager and persist them
      this.resourceManager.addResource(room101);
      this.resourceManager.addResource(room102);
      this.resourceManager.addResource(projectors);
      this.resourceManager.addResource(laptops);
      this.resourceManager.addResource(textbooks);
      
      await this.resourceDao.save(room101);
      await this.resourceDao.save(room102);
      await this.resourceDao.save(projectors);
      await this.resourceDao.save(laptops);
      await this.resourceDao.save(textbooks);
      
      // Display resources
      this.displayResources(this.resourceManager.getAllResources());
      
      // Demonstrate resource allocation
      this.resourceManager.allocateResource(3, 2); // Allocate 2 projectors
      this.resourceManager.allocateResource(4, 5); // Allocate 5 laptops
      
      // Update displayed resources to show allocation
      this.displayResources(this.resourceManager.getAllResources());
      
      this.updateStatus("School Management System initialized successfully!");
      this.log("School Management System initialized successfully!");
      
      // Set up event listeners for UI interactivity
      this.setupEventListeners();
      
    } catch (error) {
      this.updateStatus("Error initializing School Management System");
      this.logError("Error initializing School Management System:", error);
    }
  }
  
  private setupEventListeners(): void {
    // Implement UI event handlers here
    document.getElementById('refresh-btn')?.addEventListener('click', async () => {
      const students = await this.studentService.getAllStudents();
      this.displayStudents(students);
      
      const courses = await this.courseService.getAllCourses();
      this.displayCourses(courses);
      
      const resources = this.resourceManager.getAllResources();
      this.displayResources(resources);
      
      const teachers = await this.teacherService.getAllTeachers();
      this.displayTeachers(teachers);
    });
  }
  
  private displayStudents(students: Student[]): void {
    if (!this.studentsListElement) return;
    
    let html = '<ul class="items-list">';
    students.forEach(student => {
      html += `<li>
        <strong>${student.name}</strong> (ID: ${student.id})
        ${student.courses.length > 0 ? 
          `<br>Courses: ${student.courses.map(c => c.name).join(', ')}` : 
          ''}
        ${student.services.length > 0 ? 
          `<br>Services: ${student.services.map(s => s.name).join(', ')}` : 
          ''}
      </li>`;
    });
    html += '</ul>';
    
    this.studentsListElement.innerHTML = html;
  }
  
  private displayCourses(courses: Course[]): void {
    if (!this.coursesListElement) return;
    
    let html = '<ul class="items-list">';
    courses.forEach(course => {
      html += `<li>
        <strong>${course.name}</strong> (ID: ${course.id})
        <br>Teacher: ${course.teacher ? course.teacher.name : 'Not assigned'}
      </li>`;
    });
    html += '</ul>';
    
    this.coursesListElement.innerHTML = html;
  }
  
  private displayTeachers(teachers: Teacher[]): void {
    if (!this.teachersListElement) return;
    
    let html = '<ul class="items-list">';
    teachers.forEach(teacher => {
      html += `<li>
        <strong>${teacher.name}</strong> (ID: ${teacher.id})
        <br>Specialization: ${teacher.specialization}
      </li>`;
    });
    html += '</ul>';
    
    this.teachersListElement.innerHTML = html;
  }
  
  private displayResources(resources: Resource[]): void {
    if (!this.resourcesListElement) return;
    
    let html = '<ul class="items-list">';
    resources.forEach(resource => {
      html += `<li>
        <strong>${resource.name}</strong> (ID: ${resource.id})
        <br>Type: ${resource.type}
        ${resource.quantity !== undefined ? `<br>Quantity: ${resource.quantity}` : ''}
      </li>`;
    });
    html += '</ul>';
    
    this.resourcesListElement.innerHTML = html;
  }
  
  private updateStatus(message: string): void {
    if (this.statusElement) {
      this.statusElement.textContent = message;
    }
  }
  
  private log(message: string): void {
    console.log(message);
    if (this.logElement) {
      const logEntry = document.createElement('div');
      logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
      this.logElement.appendChild(logEntry);
      this.logElement.scrollTop = this.logElement.scrollHeight;
    }
  }
  
  private logError(message: string, error: any): void {
    console.error(message, error);
    if (this.logElement) {
      const logEntry = document.createElement('div');
      logEntry.style.color = 'red';
      logEntry.textContent = `[${new Date().toLocaleTimeString()}] ERROR: ${message} ${error.message || JSON.stringify(error)}`;
      this.logElement.appendChild(logEntry);
      this.logElement.scrollTop = this.logElement.scrollHeight;
    }
  }
}
