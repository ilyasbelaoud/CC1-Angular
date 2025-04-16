export class IndexedDBHelper {
  private static readonly DB_NAME = 'SchoolManagementDB';
  private static readonly DB_VERSION = 1;
  private static db: IDBDatabase | null = null;

  public static async initDatabase(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('students')) {
          db.createObjectStore('students', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('teachers')) {
          db.createObjectStore('teachers', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('courses')) {
          db.createObjectStore('courses', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('services')) {
          db.createObjectStore('services', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('resources')) {
          db.createObjectStore('resources', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('Error opening database:', event);
        reject('Error opening database');
      };
    });
  }

  public static async getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    const db = await this.initDatabase();
    const transaction = db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }
} 