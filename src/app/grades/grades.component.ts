import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Grade {
  id: number;
  studentName: string;
  courseName: string;
  score: number;
  date: string;
  comments: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  class: string;
  enrollmentDate: string;
}

interface Course {
  id: number;
  name: string;
  description: string;
  teacherName: string;
  credits: number;
}

interface GradeInput {
  studentName: string;
  courseName: string;
  score: number;
  date: string;
  comments: string;
}

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestion des notes</h2>
      
      <div class="search-box">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          placeholder="Rechercher..." 
          (input)="applyFilters()"
        >
      </div>
      
      <button class="btn btn-primary" (click)="openAddForm()">Ajouter une note</button>
      
      <!-- Add Form -->
      <div *ngIf="showAddForm" class="form-container">
        <h3>Ajouter une nouvelle note</h3>
        <form (submit)="addGrade()">
          <div class="form-group">
            <label for="student">Étudiant</label>
            <select id="student" [(ngModel)]="newGrade.studentName" name="student" required>
              <option value="" disabled selected>Sélectionnez un étudiant</option>
              <option *ngFor="let student of students" [value]="student.name">{{ student.name }}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="course">Cours</label>
            <select id="course" [(ngModel)]="newGrade.courseName" name="course" required>
              <option value="" disabled selected>Sélectionnez un cours</option>
              <option *ngFor="let course of courses" [value]="course.name">{{ course.name }}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="score">Note</label>
            <input type="number" id="score" [(ngModel)]="newGrade.score" name="score" min="0" max="20" step="0.5" required>
          </div>
          
          <div class="form-group">
            <label for="date">Date</label>
            <input type="date" id="date" [(ngModel)]="newGrade.date" name="date" required>
          </div>
          
          <div class="form-group">
            <label for="comments">Commentaires</label>
            <textarea id="comments" [(ngModel)]="newGrade.comments" name="comments" rows="3"></textarea>
          </div>
          
          <div class="form-action">
            <button type="button" class="btn btn-secondary" (click)="showAddForm = false">Annuler</button>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
          </div>
        </form>
      </div>
      
      <table class="grades-table">
        <thead>
          <tr>
            <th>Étudiant</th>
            <th>Cours</th>
            <th>Note</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let grade of filteredGrades">
            <td>{{ grade.studentName }}</td>
            <td>{{ grade.courseName }}</td>
            <td [ngClass]="getScoreClass(grade.score)">{{ grade.score }}/20</td>
            <td>{{ grade.date }}</td>
            <td class="actions">
              <button class="btn btn-view" (click)="viewGrade(grade)">Détails</button>
              <button class="btn btn-edit" (click)="editGrade(grade)">Modifier</button>
              <button class="btn btn-delete" (click)="deleteGrade(grade.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- View Modal -->
      <div *ngIf="showViewModal" class="modal">
        <div class="modal-content">
          <span class="close" (click)="showViewModal = false">&times;</span>
          <h3>Détails de la note</h3>
          <p><strong>Étudiant:</strong> {{ selectedGrade?.studentName }}</p>
          <p><strong>Cours:</strong> {{ selectedGrade?.courseName }}</p>
          <p><strong>Note:</strong> 
            <span [ngClass]="getScoreClass(selectedGrade?.score || 0)">{{ selectedGrade?.score }}/20</span>
          </p>
          <p><strong>Date:</strong> {{ selectedGrade?.date }}</p>
          <p><strong>Commentaires:</strong> {{ selectedGrade?.comments }}</p>
        </div>
      </div>
      
      <!-- Edit Modal -->
      <div *ngIf="showEditModal" class="modal">
        <div class="modal-content">
          <span class="close" (click)="showEditModal = false">&times;</span>
          <h3>Modifier la note</h3>
          <form (submit)="updateGrade()">
            <div class="form-group">
              <label for="edit-student">Étudiant</label>
              <select id="edit-student" [(ngModel)]="editingGrade.studentName" name="student" required>
                <option *ngFor="let student of students" [value]="student.name">{{ student.name }}</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="edit-course">Cours</label>
              <select id="edit-course" [(ngModel)]="editingGrade.courseName" name="course" required>
                <option *ngFor="let course of courses" [value]="course.name">{{ course.name }}</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="edit-score">Note</label>
              <input type="number" id="edit-score" [(ngModel)]="editingGrade.score" name="score" min="0" max="20" step="0.5" required>
            </div>
            
            <div class="form-group">
              <label for="edit-date">Date</label>
              <input type="date" id="edit-date" [(ngModel)]="editingGrade.date" name="date" required>
            </div>
            
            <div class="form-group">
              <label for="edit-comments">Commentaires</label>
              <textarea id="edit-comments" [(ngModel)]="editingGrade.comments" name="comments" rows="3"></textarea>
            </div>
            
            <div class="form-action">
              <button type="button" class="btn btn-secondary" (click)="showEditModal = false">Annuler</button>
              <button type="submit" class="btn btn-primary">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 1.5rem;
    }
    h2 {
      margin-bottom: 1.5rem;
    }
    .search-box {
      margin-bottom: 1rem;
    }
    .search-box input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 1rem;
    }
    .btn-primary {
      background-color: #3498db;
      color: white;
    }
    .btn-secondary {
      background-color: #95a5a6;
      color: white;
    }
    .btn-view {
      background-color: #2ecc71;
      color: white;
      padding: 0.25rem 0.5rem;
      margin-right: 0.25rem;
    }
    .btn-edit {
      background-color: #f39c12;
      color: white;
      padding: 0.25rem 0.5rem;
      margin-right: 0.25rem;
    }
    .btn-delete {
      background-color: #e74c3c;
      color: white;
      padding: 0.25rem 0.5rem;
    }
    .form-container {
      background-color: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
    }
    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .form-action {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    .grades-table {
      width: 100%;
      border-collapse: collapse;
    }
    .grades-table th, 
    .grades-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .score-good {
      color: #27ae60;
      font-weight: bold;
    }
    .score-medium {
      color: #f39c12;
      font-weight: bold;
    }
    .score-poor {
      color: #e74c3c;
      font-weight: bold;
    }
    .modal {
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background-color: #fefefe;
      padding: 20px;
      border-radius: 8px;
      width: 80%;
      max-width: 500px;
      position: relative;
    }
    .close {
      position: absolute;
      top: 10px;
      right: 20px;
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
    }
  `]
})
export class GradesComponent implements OnInit {
  grades: Grade[] = [
    { 
      id: 1, 
      studentName: 'Jean Dupont', 
      courseName: 'Mathématiques', 
      score: 16.5, 
      date: '2023-06-15',
      comments: 'Excellent travail, maîtrise parfaite des concepts.'
    },
    { 
      id: 2, 
      studentName: 'Marie Durand', 
      courseName: 'Français', 
      score: 14, 
      date: '2023-06-10',
      comments: 'Bonne analyse des textes.'
    },
    { 
      id: 3, 
      studentName: 'Paul Martin', 
      courseName: 'Histoire', 
      score: 12, 
      date: '2023-06-20',
      comments: 'Des progrès à faire sur les dates.'
    }
  ];
  
  students: Student[] = [];
  courses: Course[] = [];
  
  filteredGrades: Grade[] = [...this.grades];
  searchTerm = '';
  showAddForm = false;
  
  showViewModal = false;
  selectedGrade: Grade | null = null;
  
  showEditModal = false;
  editingGrade: Grade = {
    id: 0,
    studentName: '',
    courseName: '',
    score: 0,
    date: '',
    comments: ''
  };
  
  newGrade: GradeInput = {
    studentName: '',
    courseName: '',
    score: 10,
    date: this.getCurrentDate(),
    comments: ''
  };
  
  ngOnInit(): void {
    // Load grades from localStorage
    const savedGrades = localStorage.getItem('grades');
    if (savedGrades) {
      this.grades = JSON.parse(savedGrades);
      this.filteredGrades = [...this.grades];
    }
    
    // Load data for dropdowns
    this.loadStudents();
    this.loadCourses();
  }
  
  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  }
  
  // Load the latest students from localStorage
  loadStudents(): void {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      this.students = JSON.parse(savedStudents);
      console.log('Loaded students:', this.students);
    } else {
      console.log('No students found in localStorage');
    }
  }
  
  // Load the latest courses from localStorage
  loadCourses(): void {
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      this.courses = JSON.parse(savedCourses);
      console.log('Loaded courses:', this.courses);
    } else {
      console.log('No courses found in localStorage');
      
      // If no courses in localStorage, add some default ones
      this.courses = [
        { id: 1, name: 'Mathématiques', description: 'Cours de mathématiques', teacherName: 'Prof Math', credits: 5 },
        { id: 2, name: 'Français', description: 'Cours de français', teacherName: 'Prof Français', credits: 4 },
        { id: 3, name: 'Histoire', description: 'Cours d\'histoire', teacherName: 'Prof Histoire', credits: 3 },
        { id: 4, name: 'Anglais', description: 'Cours d\'anglais', teacherName: 'Prof Anglais', credits: 3 },
        { id: 5, name: 'Physique', description: 'Cours de physique', teacherName: 'Prof Physique', credits: 4 }
      ];
      
      // Save these default courses to localStorage
      localStorage.setItem('courses', JSON.stringify(this.courses));
    }
  }
  
  // Open the add form and refresh the lists
  openAddForm(): void {
    this.loadStudents();
    this.loadCourses();
    this.showAddForm = true;
    
    // Reset new grade form
    this.newGrade = {
      studentName: '',
      courseName: '',
      score: 10,
      date: this.getCurrentDate(),
      comments: ''
    };
  }
  
  applyFilters(): void {
    if (!this.searchTerm.trim()) {
      this.filteredGrades = [...this.grades];
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredGrades = this.grades.filter(grade => 
      grade.studentName.toLowerCase().includes(term) || 
      grade.courseName.toLowerCase().includes(term) ||
      grade.comments.toLowerCase().includes(term)
    );
  }
  
  addGrade(): void {
    const newId = Math.max(0, ...this.grades.map(g => g.id)) + 1;
    const newGrade: Grade = {
      id: newId,
      studentName: this.newGrade.studentName,
      courseName: this.newGrade.courseName,
      score: this.newGrade.score,
      date: this.newGrade.date,
      comments: this.newGrade.comments
    };
    
    this.grades.push(newGrade);
    this.filteredGrades = [...this.grades];
    
    // Save to localStorage
    localStorage.setItem('grades', JSON.stringify(this.grades));
    
    // Reset form
    this.newGrade = {
      studentName: '',
      courseName: '',
      score: 10,
      date: this.getCurrentDate(),
      comments: ''
    };
    this.showAddForm = false;
  }
  
  viewGrade(grade: Grade): void {
    this.selectedGrade = grade;
    this.showViewModal = true;
  }
  
  editGrade(grade: Grade): void {
    // Refresh data for dropdowns
    this.loadStudents();
    this.loadCourses();
    
    this.editingGrade = {...grade};
    this.showEditModal = true;
  }
  
  updateGrade(): void {
    const index = this.grades.findIndex(g => g.id === this.editingGrade.id);
    
    if (index !== -1) {
      this.grades[index] = {...this.editingGrade};
      this.filteredGrades = [...this.grades];
      
      // Save to localStorage
      localStorage.setItem('grades', JSON.stringify(this.grades));
      
      this.showEditModal = false;
    }
  }
  
  deleteGrade(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      this.grades = this.grades.filter(grade => grade.id !== id);
      this.filteredGrades = this.filteredGrades.filter(grade => grade.id !== id);
      
      // Save to localStorage
      localStorage.setItem('grades', JSON.stringify(this.grades));
    }
  }
  
  getScoreClass(score: number): string {
    if (score >= 14) return 'score-good';
    if (score >= 10) return 'score-medium';
    return 'score-poor';
  }
} 