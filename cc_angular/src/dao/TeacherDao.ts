import { Teacher } from "../models/Teacher";
import { IDao } from "./IDao";
import { IndexedDBHelper } from "../utils/IndexedDBHelper";

export class TeacherDao implements IDao<Teacher> {
  private readonly STORE_NAME = 'teachers';

  async getById(id: number): Promise<Teacher | null> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME);
      return new Promise((resolve, reject) => {
        const request = store.get(id);
        
        request.onsuccess = () => {
          if (request.result) {
            resolve(this.mapToTeacher(request.result));
          } else {
            resolve(null);
          }
        };
        
        request.onerror = () => {
          reject(`Error fetching teacher with id ${id}`);
        };
      });
    } catch (error) {
      console.error('Error in getById:', error);
      return null;
    }
  }

  async getAll(): Promise<Teacher[]> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME);
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        
        request.onsuccess = () => {
          const teachers = request.result.map(data => this.mapToTeacher(data));
          resolve(teachers);
        };
        
        request.onerror = () => {
          reject('Error fetching all teachers');
        };
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      return [];
    }
  }

  async save(teacher: Teacher): Promise<void> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME, 'readwrite');
      
      // First check if teacher with this ID already exists
      return new Promise((resolve, reject) => {
        // Create a serializable version without circular references
        const serializable = {
          id: teacher.id,
          name: teacher.name,
          specialization: teacher.specialization
          // Omit assignedCourses to avoid circular references
        };
        
        // Try to get existing teacher
        const getRequest = store.get(teacher.id);
        
        getRequest.onsuccess = () => {
          // If teacher exists, update it instead of adding
          if (getRequest.result) {
            const putRequest = store.put(serializable);
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = (event) => {
              console.error("Error updating existing teacher:", event);
              reject(`Error saving teacher`);
            };
          } else {
            // Teacher doesn't exist, add new one
            const addRequest = store.add(serializable);
            addRequest.onsuccess = () => resolve();
            addRequest.onerror = (event) => {
              console.error("Error adding new teacher:", event);
              reject(`Error saving teacher`);
            };
          }
        };
        
        getRequest.onerror = (event) => {
          console.error("Error checking for existing teacher:", event);
          reject(`Error saving teacher`);
        };
      });
    } catch (error) {
      console.error('Error in save:', error);
      throw error;
    }
  }

  async update(teacher: Teacher): Promise<void> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME, 'readwrite');
      const serializable = {
        id: teacher.id,
        name: teacher.name,
        specialization: teacher.specialization
      };
      
      return new Promise((resolve, reject) => {
        const request = store.put(serializable);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(`Error updating teacher`);
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
        request.onerror = () => reject(`Error deleting teacher with id ${id}`);
      });
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  private mapToTeacher(data: any): Teacher {
    return new Teacher(
      data.id,
      data.name,
      data.specialization
    );
  }
} 