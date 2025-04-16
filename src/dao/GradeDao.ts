import { Grade } from "../models/Grade";
import { IDao } from "./IDao";
import { IndexedDBHelper } from "../utils/IndexedDBHelper";
import { StudentDao } from "./StudentDao";
import { CourseDao } from "./CourseDao";

export class GradeDao implements IDao<Grade> {
  private readonly STORE_NAME = 'grades';
  private studentDao: StudentDao;
  private courseDao: CourseDao;

  constructor(studentDao: StudentDao, courseDao: CourseDao) {
    this.studentDao = studentDao;
    this.courseDao = courseDao;
  }

  async getById(id: number): Promise<Grade | null> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME);
      return new Promise((resolve, reject) => {
        const request = store.get(id);
        
        request.onsuccess = async () => {
          if (request.result) {
            resolve(await this.mapToGrade(request.result));
          } else {
            resolve(null);
          }
        };
        
        request.onerror = () => {
          reject(`Error fetching grade with id ${id}`);
        };
      });
    } catch (error) {
      console.error('Error in getById:', error);
      return null;
    }
  }

  async getAll(): Promise<Grade[]> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME);
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        
        request.onsuccess = async () => {
          const grades = await Promise.all(request.result.map(data => this.mapToGrade(data)));
          resolve(grades);
        };
        
        request.onerror = () => {
          reject('Error fetching all grades');
        };
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      return [];
    }
  }

  async save(grade: Grade): Promise<void> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME, 'readwrite');
      
      // Create a serializable version without circular references
      const serializable = {
        id: grade.id,
        value: grade.value,
        description: grade.description,
        date: grade.date.toISOString(),
        studentId: grade.student.id,
        courseId: grade.course.id
      };
      
      return new Promise((resolve, reject) => {
        const getRequest = store.get(grade.id);
        
        getRequest.onsuccess = () => {
          if (getRequest.result) {
            const putRequest = store.put(serializable);
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = (event) => {
              console.error("Error updating existing grade:", event);
              reject(`Error saving grade`);
            };
          } else {
            const addRequest = store.add(serializable);
            addRequest.onsuccess = () => resolve();
            addRequest.onerror = (event) => {
              console.error("Error adding new grade:", event);
              reject(`Error saving grade`);
            };
          }
        };
        
        getRequest.onerror = (event) => {
          console.error("Error checking for existing grade:", event);
          reject(`Error saving grade`);
        };
      });
    } catch (error) {
      console.error('Error in save:', error);
      throw error;
    }
  }

  async update(grade: Grade): Promise<void> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME, 'readwrite');
      
      const serializable = {
        id: grade.id,
        value: grade.value,
        description: grade.description,
        date: grade.date.toISOString(),
        studentId: grade.student.id,
        courseId: grade.course.id
      };
      
      return new Promise((resolve, reject) => {
        const request = store.put(serializable);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(`Error updating grade`);
      });
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME, 'readwrite');
      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(`Error deleting grade with id ${id}`);
      });
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  async getGradesByStudent(studentId: number): Promise<Grade[]> {
    const allGrades = await this.getAll();
    return allGrades.filter(grade => grade.student.id === studentId);
  }

  async getGradesByCourse(courseId: number): Promise<Grade[]> {
    const allGrades = await this.getAll();
    return allGrades.filter(grade => grade.course.id === courseId);
  }

  private async mapToGrade(data: any): Promise<Grade> {
    const student = await this.studentDao.getById(data.studentId);
    const course = await this.courseDao.getById(data.courseId);
    
    if (!student || !course) {
      throw new Error(`Unable to map grade: student or course not found`);
    }
    
    return new Grade(
      data.id,
      data.value,
      data.description,
      new Date(data.date),
      student,
      course
    );
  }
} 