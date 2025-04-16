import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { StudentService as CoreStudentService } from '../../patterns/services/StudentService';
import { StudentDao } from '../../dao/StudentDao';
import { Student } from '../../models/Student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private coreService: CoreStudentService;
  private studentsSubject = new BehaviorSubject<Student[]>([]);
  private students: Student[] = [
    new Student(1, 'John Doe', [], [], []),
    new Student(2, 'Jane Smith', [], [], [])
  ];
  
  constructor() {
    // Créer une instance de StudentDao
    const studentDao = new StudentDao();
    // Créer une instance du service core
    this.coreService = new CoreStudentService(studentDao);
    // Charger initialement les étudiants
    this.loadStudents();
  }
  
  private loadStudents(): void {
    from(this.coreService.getAllStudents())
      .pipe(
        tap(students => this.studentsSubject.next(students)),
        catchError(error => {
          console.error('Error loading students', error);
          return of([]);
        })
      )
      .subscribe();
  }
  
  getAll(): Observable<Student[]> {
    return of(this.students);
  }
  
  getById(id: number): Observable<Student | undefined> {
    return of(this.students.find(student => student.id === id));
  }
  
  add(student: Student): Observable<Student> {
    const newId = Math.max(...this.students.map(s => s.id), 0) + 1;
    const newStudent = new Student(
      newId,
      student.name,
      student.courseIds || [],
      student.services || [],
      student.courses || []
    );
    this.students.push(newStudent);
    return of(newStudent);
  }
  
  update(updatedStudent: Student): Observable<Student> {
    const index = this.students.findIndex(s => s.id === updatedStudent.id);
    if (index !== -1) {
      this.students[index] = updatedStudent;
    }
    return of(updatedStudent);
  }
  
  delete(id: number): Observable<boolean> {
    const index = this.students.findIndex(s => s.id === id);
    if (index !== -1) {
      this.students.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
  
  getAllStudents(): Observable<Student[]> {
    // Raffraîchir les données à chaque appel
    this.loadStudents();
    // Retourner le subject
    return this.studentsSubject.asObservable();
  }
  
  getStudentById(id: number): Observable<Student | undefined> {
    return of(this.students.find(student => student.id === id));
  }
  
  addStudent(student: Student): Observable<Student> {
    return this.add(student);
  }
  
  updateStudent(student: Student): Observable<Student> {
    return this.update(student);
  }
  
  deleteStudent(id: number): Observable<boolean> {
    return this.delete(id);
  }
  
  enrollStudentInCourse(studentId: number, course: any): Observable<boolean> {
    return from(this.coreService.enrollStudentInCourse(studentId, course)).pipe(
      tap(() => this.loadStudents()),
      catchError(error => {
        console.error(`Error enrolling student in course`, error);
        return of(false);
      })
    );
  }
  
  addServiceToStudent(studentId: number, service: any): Observable<boolean> {
    return from(this.coreService.addServiceToStudent(studentId, service)).pipe(
      tap(() => this.loadStudents()),
      catchError(error => {
        console.error(`Error adding service to student`, error);
        return of(false);
      })
    );
  }
} 