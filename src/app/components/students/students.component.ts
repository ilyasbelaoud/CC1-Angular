import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../../../models/Student';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="students-container">
      <h2>Gestion des Étudiants</h2>
      
      <div class="add-student-form">
        <h3>Ajouter un Étudiant</h3>
        <div class="form-group">
          <label>Nom complet:</label>
          <input type="text" [(ngModel)]="newStudent.name">
        </div>
        <button (click)="addStudent()">Ajouter</button>
      </div>
    
      <div class="students-list">
        <h3>Liste des Étudiants</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let student of students">
              <td>{{ student.id }}</td>
              <td>{{ student.name }}</td>
              <td>
                <button (click)="selectStudent(student)">Modifier</button>
                <button (click)="deleteStudent(student.id)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    
      <div *ngIf="isEditing && selectedStudent" class="edit-student">
        <h3>Modifier l'Étudiant</h3>
        <div class="form-group">
          <label>Nom complet:</label>
          <input type="text" [(ngModel)]="selectedStudent.name">
        </div>
        <div class="button-group">
          <button (click)="saveStudent()">Enregistrer</button>
          <button (click)="cancelEdit()">Annuler</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .students-container {
      padding: 20px;
    }
    .form-group {
      margin-bottom: 10px;
    }
    input {
      padding: 5px;
      width: 100%;
    }
    button {
      padding: 5px 10px;
      margin-right: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
  `]
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  selectedStudent: Student | null = null;
  isEditing = false;
  newStudent: Student;

  constructor(private studentService: StudentService) {
    this.newStudent = new Student(0, '', [], [], []);
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getAll().subscribe(students => {
      this.students = students;
    });
  }

  selectStudent(student: Student): void {
    this.selectedStudent = {...student};
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.selectedStudent = null;
    this.isEditing = false;
  }

  saveStudent(): void {
    if (this.selectedStudent) {
      this.studentService.update(this.selectedStudent).subscribe(() => {
        this.loadStudents();
        this.cancelEdit();
      });
    }
  }

  addStudent(): void {
    this.studentService.add(this.newStudent).subscribe(() => {
      this.loadStudents();
      this.newStudent = new Student(0, '', [], [], []);
    });
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.delete(id).subscribe(() => {
        this.loadStudents();
        if (this.selectedStudent?.id === id) {
          this.cancelEdit();
        }
      });
    }
  }
} 