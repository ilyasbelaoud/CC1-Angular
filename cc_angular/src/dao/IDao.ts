export interface IDao<T> {
  getById(id: number): Promise<T | null>;
  getAll(): Promise<T[]>;
  save(item: T): Promise<void>;
  update(item: T): Promise<void>;
  delete(id: number): Promise<void>;
} 