import { TeacherDao } from "../../dao/TeacherDao";
import { Teacher } from "../../models/Teacher";
import { CourseService } from "./CourseService";

export class TeacherService {
  private teacherDao: TeacherDao;
  private courseService: CourseService;
  
  constructor(teacherDao: TeacherDao, courseService: CourseService) {
    this.teacherDao = teacherDao;
    this.courseService = courseService;
  }
  
  async registerTeacher(teacher: Teacher): Promise<void> {
    await this.teacherDao.save(teacher);
  }
  
  async getTeacherById(id: number): Promise<Teacher | null> {
    return await this.teacherDao.getById(id);
  }
  
  async getAllTeachers(): Promise<Teacher[]> {
    return await this.teacherDao.getAll();
  }
  
  async updateTeacher(teacher: Teacher): Promise<void> {
    await this.teacherDao.update(teacher);
  }
  
  async deleteTeacher(id: number): Promise<void> {
    await this.teacherDao.delete(id);
  }
  
  async getTeachersBySpecialization(specialization: string): Promise<Teacher[]> {
    const allTeachers = await this.teacherDao.getAll();
    return allTeachers.filter(teacher => teacher.specialization === specialization);
  }
  
  async getTeacherCourses(teacherId: number): Promise<any[]> {
    return await this.courseService.getCoursesByTeacher(teacherId);
  }
} 