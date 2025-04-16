import { Classroom } from "../models/Classroom";
import { IDao } from "./IDao";
import { IndexedDBHelper } from "../utils/IndexedDBHelper";
import { TeacherDao } from "./TeacherDao";

export class ClassroomDao implements IDao<Classroom> {
  private readonly STORE_NAME = 'classrooms';
  private teacherDao: TeacherDao;

  constructor(teacherDao: TeacherDao) {
    this.teacherDao = teacherDao;
  }

  async getById(id: number): Promise<Classroom | null> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME);
      return new Promise((resolve, reject) => {
        const request = store.get(id);
        
        request.onsuccess = async () => {
          if (request.result) {
            resolve(await this.mapToClassroom(request.result));
          } else {
            resolve(null);
          }
        };
        
        request.onerror = () => {
          reject(`Error fetching classroom with id ${id}`);
        };
      });
    } catch (error) {
      console.error('Error in getById:', error);
      return null;
    }
  }

  async getAll(): Promise<Classroom[]> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME);
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        
        request.onsuccess = async () => {
          const classrooms = await Promise.all(request.result.map(data => this.mapToClassroom(data)));
          resolve(classrooms);
        };
        
        request.onerror = () => {
          reject('Error fetching all classrooms');
        };
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      return [];
    }
  }

  async save(classroom: Classroom): Promise<void> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME, 'readwrite');
      
      // Create a serializable version
      const serializable = {
        id: classroom.id,
        name: classroom.name,
        capacity: classroom.capacity,
        mainTeacherId: classroom.mainTeacher ? classroom.mainTeacher.id : null,
        studentIds: classroom.students.map(student => student.id),
        courseIds: classroom.courses.map(course => course.id)
      };
      
      return new Promise((resolve, reject) => {
        const getRequest = store.get(classroom.id);
        
        getRequest.onsuccess = () => {
          if (getRequest.result) {
            const putRequest = store.put(serializable);
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = (event) => {
              console.error("Error updating existing classroom:", event);
              reject(`Error saving classroom`);
            };
          } else {
            const addRequest = store.add(serializable);
            addRequest.onsuccess = () => resolve();
            addRequest.onerror = (event) => {
              console.error("Error adding new classroom:", event);
              reject(`Error saving classroom`);
            };
          }
        };
        
        getRequest.onerror = (event) => {
          console.error("Error checking for existing classroom:", event);
          reject(`Error saving classroom`);
        };
      });
    } catch (error) {
      console.error('Error in save:', error);
      throw error;
    }
  }

  async update(classroom: Classroom): Promise<void> {
    return this.save(classroom);
  }

  async delete(id: number): Promise<void> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME, 'readwrite');
      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(`Error deleting classroom with id ${id}`);
      });
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  private async mapToClassroom(data: any): Promise<Classroom> {
    const mainTeacher = data.mainTeacherId ? 
      await this.teacherDao.getById(data.mainTeacherId) : null;
    
    return new Classroom(
      data.id,
      data.name,
      data.capacity,
      [], // Students will be populated separately
      mainTeacher,
      [] // Courses will be populated separately
    );
  }
} 