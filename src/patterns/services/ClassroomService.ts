import { Classroom } from "../../models/Classroom";
import { ClassroomDao } from "../../dao/ClassroomDao";
import { Student } from "../../models/Student";
import { Teacher } from "../../models/Teacher";
import { Course } from "../../models/Course";

export class ClassroomService {
  private classroomDao: ClassroomDao;
  
  constructor(classroomDao: ClassroomDao) {
    this.classroomDao = classroomDao;
  }
  
  async createClassroom(classroom: Classroom): Promise<void> {
    await this.classroomDao.save(classroom);
  }
  
  async getClassroomById(id: number): Promise<Classroom | null> {
    return await this.classroomDao.getById(id);
  }
  
  async getAllClassrooms(): Promise<Classroom[]> {
    return await this.classroomDao.getAll();
  }
  
  async updateClassroom(classroom: Classroom): Promise<void> {
    await this.classroomDao.update(classroom);
  }
  
  async deleteClassroom(id: number): Promise<void> {
    await this.classroomDao.delete(id);
  }
  
  async assignTeacherToClassroom(classroomId: number, teacher: Teacher): Promise<void> {
    const classroom = await this.classroomDao.getById(classroomId);
    if (classroom) {
      classroom.mainTeacher = teacher;
      await this.classroomDao.update(classroom);
    } else {
      throw new Error(`Classroom with ID ${classroomId} not found`);
    }
  }
  
  async addStudentToClassroom(classroomId: number, student: Student): Promise<void> {
    const classroom = await this.classroomDao.getById(classroomId);
    if (classroom) {
      if (!classroom.students.some(s => s.id === student.id)) {
        classroom.students.push(student);
        await this.classroomDao.update(classroom);
      }
    } else {
      throw new Error(`Classroom with ID ${classroomId} not found`);
    }
  }
  
  async addCourseToClassroom(classroomId: number, course: Course): Promise<void> {
    const classroom = await this.classroomDao.getById(classroomId);
    if (classroom) {
      if (!classroom.courses.some(c => c.id === course.id)) {
        classroom.courses.push(course);
        await this.classroomDao.update(classroom);
      }
    } else {
      throw new Error(`Classroom with ID ${classroomId} not found`);
    }
  }
} 