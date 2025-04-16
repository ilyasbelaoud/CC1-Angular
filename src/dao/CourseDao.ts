import { Course } from "../models/Course";
import { IDao } from "./IDao";
import { IndexedDBHelper } from "../utils/IndexedDBHelper";
import { TeacherDao } from "./TeacherDao";

export class CourseDao implements IDao<Course> {
  private readonly STORE_NAME = 'courses';
  private teacherDao: TeacherDao;

  constructor(teacherDao: TeacherDao) {
    this.teacherDao = teacherDao;
  }

  async getById(id: number): Promise<Course | null> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME);
      return new Promise((resolve, reject) => {
        const request = store.get(id);
        
        request.onsuccess = async () => {
          if (request.result) {
            const course = await this.mapToCourse(request.result);
            resolve(course);
          } else {
            resolve(null);
          }
        };
        
        request.onerror = () => {
          reject(`Error fetching course with id ${id}`);
        };
      });
    } catch (error) {
      console.error('Error in getById:', error);
      return null;
    }
  }

  async getAll(): Promise<Course[]> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME);
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        
        request.onsuccess = async () => {
          const courses = [];
          for (const data of request.result) {
            courses.push(await this.mapToCourse(data));
          }
          resolve(courses);
        };
        
        request.onerror = () => {
          reject('Error fetching all courses');
        };
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      return [];
    }
  }

  async save(course: Course): Promise<void> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME, 'readwrite');
      // First check if course with this ID already exists
      return new Promise((resolve, reject) => {
        // Create a serializable version without circular references
        const serializable = {
          id: course.id,
          name: course.name,
          teacherId: course.teacher ? course.teacher.id : null
          // Don't include students array to avoid circular references
        };
        
        // Try to get existing course
        const getRequest = store.get(course.id);
        
        getRequest.onsuccess = () => {
          // If course exists, update it instead of adding
          if (getRequest.result) {
            const putRequest = store.put(serializable);
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = (event) => {
              console.error("Error updating existing course:", event);
              reject(`Error saving course`);
            };
          } else {
            // Course doesn't exist, add new one
            const addRequest = store.add(serializable);
            addRequest.onsuccess = () => resolve();
            addRequest.onerror = (event) => {
              console.error("Error adding new course:", event);
              reject(`Error saving course`);
            };
          }
        };
        
        getRequest.onerror = (event) => {
          console.error("Error checking for existing course:", event);
          reject(`Error saving course`);
        };
      });
    } catch (error) {
      console.error('Error in save:', error);
      throw error;
    }
  }

  async update(course: Course): Promise<void> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME, 'readwrite');
      const serializable = {
        id: course.id,
        name: course.name,
        teacherId: course.teacher ? course.teacher.id : null
      };
      
      return new Promise((resolve, reject) => {
        const request = store.put(serializable);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(`Error updating course`);
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
        request.onerror = () => reject(`Error deleting course with id ${id}`);
      });
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  private async mapToCourse(data: any): Promise<Course> {
    const teacher = data.teacherId ? await this.teacherDao.getById(data.teacherId) : null;
    return new Course(
      data.id,
      data.name,
      teacher
    );
  }
} 