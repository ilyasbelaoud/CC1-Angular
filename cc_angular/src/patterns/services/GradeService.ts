import { Grade } from "../../models/Grade";
import { GradeDao } from "../../dao/GradeDao";
import { Student } from "../../models/Student";
import { Course } from "../../models/Course";

export class GradeService {
  private gradeDao: GradeDao;
  
  constructor(gradeDao: GradeDao) {
    this.gradeDao = gradeDao;
  }
  
  async addGrade(grade: Grade): Promise<void> {
    await this.gradeDao.save(grade);
  }
  
  async getGradeById(id: number): Promise<Grade | null> {
    return await this.gradeDao.getById(id);
  }
  
  async getAllGrades(): Promise<Grade[]> {
    return await this.gradeDao.getAll();
  }
  
  async updateGrade(grade: Grade): Promise<void> {
    await this.gradeDao.update(grade);
  }
  
  async deleteGrade(id: number): Promise<void> {
    await this.gradeDao.delete(id);
  }
  
  async getStudentGrades(studentId: number): Promise<Grade[]> {
    return await this.gradeDao.getGradesByStudent(studentId);
  }
  
  async getCourseGrades(courseId: number): Promise<Grade[]> {
    return await this.gradeDao.getGradesByCourse(courseId);
  }
  
  async calculateStudentAverage(studentId: number): Promise<number> {
    const grades = await this.gradeDao.getGradesByStudent(studentId);
    if (grades.length === 0) return 0;
    
    const sum = grades.reduce((total, grade) => total + grade.value, 0);
    return sum / grades.length;
  }
  
  async calculateCourseAverage(courseId: number): Promise<number> {
    const grades = await this.gradeDao.getGradesByCourse(courseId);
    if (grades.length === 0) return 0;
    
    const sum = grades.reduce((total, grade) => total + grade.value, 0);
    return sum / grades.length;
  }
} 