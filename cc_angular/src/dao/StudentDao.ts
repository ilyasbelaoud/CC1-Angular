import { Injectable } from '@angular/core';
import { Student } from "../models/Student";
import { IDao } from "./IDao";
import { IndexedDBHelper } from "../utils/IndexedDBHelper";

@Injectable({
  providedIn: 'root'
})
export class StudentDao implements IDao<Student> {
  private readonly STORE_NAME = 'students';

  async getById(id: number): Promise<Student | null> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME);
      return new Promise((resolve, reject) => {
        const request = store.get(id);
        
        request.onsuccess = () => {
          if (request.result) {
            resolve(this.mapToStudent(request.result));
          } else {
            resolve(null);
          }
        };
        
        request.onerror = () => {
          reject(`Error fetching student with id ${id}`);
        };
      });
    } catch (error) {
      console.error('Error in getById:', error);
      return null;
    }
  }

  async getAll(): Promise<Student[]> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME);
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        
        request.onsuccess = () => {
          const students = request.result.map(data => this.mapToStudent(data));
          resolve(students);
        };
        
        request.onerror = () => {
          reject('Error fetching all students');
        };
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      return [];
    }
  }

  async save(student: Student): Promise<void> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME, 'readwrite');
      
      // Create a serializable version without circular references
      const serializable = {
        id: student.id,
        name: student.name,
        courseIds: student.courses.map(course => course.id),
        serviceIds: student.services.map(service => service.id)
      };
      
      return new Promise((resolve, reject) => {
        // Check if student with this ID already exists
        const getRequest = store.get(student.id);
        
        getRequest.onsuccess = () => {
          // If student exists, update it
          if (getRequest.result) {
            const putRequest = store.put(serializable);
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = (event) => {
              console.error("Error updating existing student:", event);
              reject(`Error saving student`);
            };
          } else {
            // Student doesn't exist, add new one
            const addRequest = store.add(serializable);
            addRequest.onsuccess = () => resolve();
            addRequest.onerror = (event) => {
              console.error("Error adding new student:", event);
              reject(`Error saving student`);
            };
          }
        };
        
        getRequest.onerror = (event) => {
          console.error("Error checking for existing student:", event);
          reject(`Error saving student`);
        };
      });
    } catch (error) {
      console.error('Error in save:', error);
      throw error;
    }
  }

  async update(student: Student): Promise<void> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME, 'readwrite');
      
      // Create a serializable version without circular references
      const serializable = {
        id: student.id,
        name: student.name,
        courseIds: student.courses.map(course => course.id),
        serviceIds: student.services.map(service => service.id)
      };
      
      return new Promise((resolve, reject) => {
        const request = store.put(serializable);
        
        request.onsuccess = () => resolve();
        request.onerror = (event) => {
          console.error("Error updating student:", event);
          reject(`Error updating student`);
        };
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
        request.onerror = () => reject(`Error deleting student with id ${id}`);
      });
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  private mapToStudent(data: any): Student {
    return new Student(
      data.id,
      data.name,
      data.courses || [],
      data.services || []
    );
  }
} 