import { IDao } from "../../dao/IDao";
import { Student } from "../../models/Student";
import { Service } from "../../models/Service";
import { Course } from "../../models/Course";

// Service using Dependency Injection
export class StudentService {
  constructor(private studentDao: IDao<Student>) {}

  async getStudentById(id: number): Promise<Student | null> {
    return this.studentDao.getById(id);
  }

  async getAllStudents(): Promise<Student[]> {
    return this.studentDao.getAll();
  }

  async registerStudent(student: Student): Promise<void> {
    await this.studentDao.save(student);
  }

  async updateStudent(student: Student): Promise<void> {
    await this.studentDao.update(student);
  }

  async deleteStudent(id: number): Promise<void> {
    await this.studentDao.delete(id);
  }

  async enrollStudentInCourse(studentId: number, course: Course): Promise<boolean> {
    const student = await this.getStudentById(studentId);
    if (!student) return false;

    // Check if student is already enrolled
    if (!student.courses.some(c => c.id === course.id)) {
      student.courses.push(course);
      await this.updateStudent(student);
      
      // Also update the course's students list
      if (!course.students.some(s => s.id === student.id)) {
        course.students.push(student);
      }
    }
    
    return true;
  }

  async addServiceToStudent(studentId: number, service: Service): Promise<boolean> {
    const student = await this.getStudentById(studentId);
    if (!student) return false;

    service.applyToStudent(student);
    await this.updateStudent(student);
    return true;
  }
} 