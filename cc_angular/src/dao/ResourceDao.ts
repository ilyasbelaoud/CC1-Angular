import { Resource } from "../models/Resource";
import { IDao } from "./IDao";
import { IndexedDBHelper } from "../utils/IndexedDBHelper";

export class ResourceDao implements IDao<Resource> {
  private readonly STORE_NAME = 'resources';

  async getById(id: number): Promise<Resource | null> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME);
      return new Promise((resolve, reject) => {
        const request = store.get(id);
        
        request.onsuccess = () => {
          if (request.result) {
            resolve(this.mapToResource(request.result));
          } else {
            resolve(null);
          }
        };
        
        request.onerror = () => {
          reject(`Error fetching resource with id ${id}`);
        };
      });
    } catch (error) {
      console.error('Error in getById:', error);
      return null;
    }
  }

  async getAll(): Promise<Resource[]> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME);
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        
        request.onsuccess = () => {
          const resources = request.result.map(data => this.mapToResource(data));
          resolve(resources);
        };
        
        request.onerror = () => {
          reject('Error fetching all resources');
        };
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      return [];
    }
  }

  async save(resource: Resource): Promise<void> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME, 'readwrite');
      
      return new Promise((resolve, reject) => {
        const request = store.add(resource);
        
        request.onsuccess = () => resolve();
        request.onerror = (event) => {
          console.error("Error saving resource:", event);
          reject(`Error saving resource`);
        };
      });
    } catch (error) {
      console.error('Error in save:', error);
      throw error;
    }
  }

  async update(resource: Resource): Promise<void> {
    try {
      const store = await IndexedDBHelper.getStore(this.STORE_NAME, 'readwrite');
      return new Promise((resolve, reject) => {
        const request = store.put(resource);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(`Error updating resource`);
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
        request.onerror = () => reject(`Error deleting resource with id ${id}`);
      });
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  private mapToResource(data: any): Resource {
    return new Resource(
      data.id,
      data.name,
      data.type,
      data.quantity
    );
  }
} 