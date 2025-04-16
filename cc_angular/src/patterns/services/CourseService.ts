import { CourseDao } from "../../dao/CourseDao";
import { Course } from "../../models/Course";
import { Teacher } from "../../models/Teacher";

export class CourseService {
  private courseDao: CourseDao;
  
  constructor(courseDao: CourseDao) {
    this.courseDao = courseDao;
  }
  
  async createCourse(course: Course): Promise<void> {
    await this.courseDao.save(course);
  }
  
  async getCourseById(id: number): Promise<Course | null> {
    return await this.courseDao.getById(id);
  }
  
  async getAllCourses(): Promise<Course[]> {
    return await this.courseDao.getAll();
  }
  
  async updateCourse(course: Course): Promise<void> {
    await this.courseDao.update(course);
  }
  
  async deleteCourse(id: number): Promise<void> {
    await this.courseDao.delete(id);
  }
  
  async assignTeacherToCourse(courseId: number, teacher: Teacher): Promise<void> {
    const course = await this.courseDao.getById(courseId);
    if (course) {
      course.teacher = teacher;
      await this.courseDao.update(course);
    } else {
      throw new Error(`Course with ID ${courseId} not found`);
    }
  }
  
  async getCoursesByTeacher(teacherId: number): Promise<Course[]> {
    const allCourses = await this.courseDao.getAll();
    return allCourses.filter((course: Course) => course.teacher && course.teacher.id === teacherId);
  }
} 