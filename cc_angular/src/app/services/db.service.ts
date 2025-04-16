import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private dbName = 'schoolManagementDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDatabase();
  }

  private initDatabase(): void {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores with auto-incrementing IDs
      if (!db.objectStoreNames.contains('students')) {
        db.createObjectStore('students', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('teachers')) {
        db.createObjectStore('teachers', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('courses')) {
        db.createObjectStore('courses', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('classrooms')) {
        db.createObjectStore('classrooms', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('grades')) {
        db.createObjectStore('grades', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('services')) {
        db.createObjectStore('services', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event: Event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      console.log('Database initialized successfully');
      
      // Initialize with sample data if empty
      this.initializeSampleData();
    };

    request.onerror = (event: Event) => {
      console.error('Error opening database:', (event.target as IDBOpenDBRequest).error);
    };
  }
  
  private initializeSampleData(): void {
    // Check if we need to add sample data
    this.getAll('students').subscribe(students => {
      if (students.length === 0) {
        // Add sample students
        const sampleStudents = [
          { name: 'Jean Dupont', email: 'jean.dupont@email.com', class: 'Terminal S', enrollmentDate: '05/09/2022' },
          { name: 'Marie Durand', email: 'marie.durand@email.com', class: 'Première ES', enrollmentDate: '06/09/2022' },
          { name: 'Paul Martin', email: 'paul.martin@email.com', class: 'Seconde A', enrollmentDate: '04/09/2022' },
          { name: 'Sophie Petit', email: 'sophie.petit@email.com', class: 'Terminal L', enrollmentDate: '05/09/2022' },
          { name: 'Lucas Bernard', email: 'lucas.bernard@email.com', class: 'Première S', enrollmentDate: '06/09/2022' }
        ];
        
        sampleStudents.forEach(student => {
          this.add('students', student).subscribe();
        });
      }
    });
    
    this.getAll('teachers').subscribe(teachers => {
      if (teachers.length === 0) {
        // Add sample teachers
        const sampleTeachers = [
          { name: 'Alexandre Martin', email: 'alexandre.martin@email.com', subject: 'Mathématiques', hireDate: '15/09/2018' },
          { name: 'Émilie Dubois', email: 'emilie.dubois@email.com', subject: 'Français', hireDate: '10/09/2019' },
          { name: 'Thomas Laurent', email: 'thomas.laurent@email.com', subject: 'Histoire-Géographie', hireDate: '01/09/2020' },
          { name: 'Camille Robert', email: 'camille.robert@email.com', subject: 'Sciences Physiques', hireDate: '20/08/2017' },
          { name: 'Nicolas Bernard', email: 'nicolas.bernard@email.com', subject: 'Anglais', hireDate: '05/09/2021' }
        ];
        
        sampleTeachers.forEach(teacher => {
          this.add('teachers', teacher).subscribe();
        });
      }
    });
    
    // Similar initialization for other stores
  }

  // Generic CRUD operations
  getAll<T>(storeName: string): Observable<T[]> {
    return new Observable<T[]>(observer => {
      if (!this.db) {
        observer.error('Database not initialized');
        return;
      }

      try {
        const transaction = this.db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          observer.next(request.result);
          observer.complete();
        };

        request.onerror = () => {
          observer.error(request.error);
        };
      } catch (error) {
        observer.error(error);
      }
    });
  }

  getById<T>(storeName: string, id: number): Observable<T | undefined> {
    return new Observable<T | undefined>(observer => {
      if (!this.db) {
        observer.error('Database not initialized');
        return;
      }

      try {
        const transaction = this.db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = () => {
          observer.next(request.result);
          observer.complete();
        };

        request.onerror = () => {
          observer.error(request.error);
        };
      } catch (error) {
        observer.error(error);
      }
    });
  }

  add<T>(storeName: string, item: T): Observable<T> {
    return new Observable<T>(observer => {
      if (!this.db) {
        observer.error('Database not initialized');
        return;
      }

      try {
        const transaction = this.db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(item);

        request.onsuccess = () => {
          // Get the item with the assigned ID
          const getRequest = store.get(request.result);
          getRequest.onsuccess = () => {
            observer.next(getRequest.result);
            observer.complete();
          };
        };

        request.onerror = () => {
          observer.error(request.error);
        };
      } catch (error) {
        observer.error(error);
      }
    });
  }

  update<T>(storeName: string, item: T): Observable<T> {
    return new Observable<T>(observer => {
      if (!this.db) {
        observer.error('Database not initialized');
        return;
      }

      try {
        const transaction = this.db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);

        request.onsuccess = () => {
          observer.next(item);
          observer.complete();
        };

        request.onerror = () => {
          observer.error(request.error);
        };
      } catch (error) {
        observer.error(error);
      }
    });
  }

  delete(storeName: string, id: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      if (!this.db) {
        observer.error('Database not initialized');
        return;
      }

      try {
        const transaction = this.db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => {
          observer.next(true);
          observer.complete();
        };

        request.onerror = () => {
          observer.error(request.error);
        };
      } catch (error) {
        observer.error(error);
      }
    });
  }
} 