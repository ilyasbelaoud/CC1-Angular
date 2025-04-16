import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Teacher {
  id: number;
  name: string;
  email: string;
  subject: string;
  hireDate: string;
}

interface Course {
  id: number;
  name: string;
  description: string;
  teacherId: number;
  credits: number;
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestion des cours</h2>
      
      <div class="search-box">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          placeholder="Rechercher un cours..." 
          (input)="filterCourses()"
        >
      </div>
      
      <button class="btn btn-primary" (click)="openAddForm()">Ajouter un cours</button>
      
      <!-- Add Form -->
      <div *ngIf="showAddForm" class="form-container">
        <h3>Ajouter un nouveau cours</h3>
        <form (submit)="addCourse()">
          <div class="form-group">
            <label for="name">Nom du cours</label>
            <input type="text" id="name" [(ngModel)]="newCourse.name" name="name" required>
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" [(ngModel)]="newCourse.description" name="description" rows="3" required></textarea>
          </div>
          
          <div class="form-group">
            <label for="teacherId">Enseignant</label>
            <select id="teacherId" [(ngModel)]="newCourse.teacherId" name="teacherId" required>
              <option [ngValue]="null" disabled>Sélectionnez un enseignant</option>
              <option *ngFor="let teacher of availableTeachers" [ngValue]="teacher.id">
                {{ teacher.name }} ({{ teacher.subject }})
              </option>
            </select>
            <div *ngIf="availableTeachers.length === 0" class="error-message">
              Aucun enseignant disponible. Veuillez d'abord ajouter des enseignants.
            </div>
          </div>
          
          <div class="form-group">
            <label for="credits">Crédits</label>
            <input type="number" id="credits" [(ngModel)]="newCourse.credits" name="credits" min="1" max="60" required>
          </div>
          
          <div class="form-action">
            <button type="button" class="btn btn-secondary" (click)="showAddForm = false">Annuler</button>
            <button type="submit" class="btn btn-primary" [disabled]="availableTeachers.length === 0">Enregistrer</button>
          </div>
        </form>
      </div>
      
      <table class="courses-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Enseignant</th>
            <th>Crédits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let course of filteredCourses">
            <td>{{ course.id }}</td>
            <td>{{ course.name }}</td>
            <td>{{ truncateDescription(course.description) }}</td>
            <td>{{ getTeacherName(course.teacherId) }}</td>
            <td>{{ course.credits }}</td>
            <td class="actions">
              <button class="btn btn-view" (click)="viewCourse(course)">Voir</button>
              <button class="btn btn-edit" (click)="editCourse(course)">Modifier</button>
              <button class="btn btn-delete" (click)="deleteCourse(course.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- View Modal -->
      <div *ngIf="showViewModal" class="modal">
        <div class="modal-content">
          <span class="close" (click)="showViewModal = false">&times;</span>
          <h3>Détails du cours</h3>
          <p><strong>ID:</strong> {{ selectedCourse?.id }}</p>
          <p><strong>Nom:</strong> {{ selectedCourse?.name }}</p>
          <p><strong>Description:</strong> {{ selectedCourse?.description }}</p>
          <p><strong>Enseignant:</strong> {{ getTeacherName(selectedCourse?.teacherId) }}</p>
          <p><strong>Crédits:</strong> {{ selectedCourse?.credits }}</p>
        </div>
      </div>
      
      <!-- Edit Modal -->
      <div *ngIf="showEditModal" class="modal">
        <div class="modal-content">
          <span class="close" (click)="showEditModal = false">&times;</span>
          <h3>Modifier le cours</h3>
          <form (submit)="updateCourse()">
            <div class="form-group">
              <label for="edit-name">Nom du cours</label>
              <input type="text" id="edit-name" [(ngModel)]="editingCourse.name" name="name" required>
            </div>
            
            <div class="form-group">
              <label for="edit-description">Description</label>
              <textarea id="edit-description" [(ngModel)]="editingCourse.description" name="description" rows="3" required></textarea>
            </div>
            
            <div class="form-group">
              <label for="edit-teacherId">Enseignant</label>
              <select id="edit-teacherId" [(ngModel)]="editingCourse.teacherId" name="teacherId" required>
                <option [ngValue]="null" disabled>Sélectionnez un enseignant</option>
                <option *ngFor="let teacher of availableTeachers" [ngValue]="teacher.id">
                  {{ teacher.name }} ({{ teacher.subject }})
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="edit-credits">Crédits</label>
              <input type="number" id="edit-credits" [(ngModel)]="editingCourse.credits" name="credits" min="1" max="60" required>
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
    .btn:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
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
    .error-message {
      color: #e74c3c;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }
    .form-action {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    .courses-table {
      width: 100%;
      border-collapse: collapse;
    }
    .courses-table th, 
    .courses-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .courses-table td.actions {
      width: 180px;
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
export class CoursesComponent implements OnInit {
  courses: Course[] = [
    { id: 1, name: 'Mathématiques avancées', description: 'Cours approfondi de mathématiques incluant l\'algèbre linéaire et le calcul différentiel', teacherId: 1, credits: 6 },
    { id: 2, name: 'Physique', description: 'Introduction aux principes fondamentaux de la physique', teacherId: 2, credits: 5 },
    { id: 3, name: 'Littérature française', description: 'Étude des classiques de la littérature française', teacherId: 3, credits: 4 },
    { id: 4, name: 'Anglais', description: 'Cours d\'anglais pour niveau intermédiaire à avancé', teacherId: 4, credits: 3 },
    { id: 5, name: 'Histoire contemporaine', description: 'Histoire du 20ème siècle et événements majeurs', teacherId: 5, credits: 4 }
  ];
  
  availableTeachers: Teacher[] = [];
  
  filteredCourses: Course[] = [...this.courses];
  searchTerm = '';
  showAddForm = false;
  
  // View and edit properties
  showViewModal = false;
  selectedCourse: Course | null = null;
  
  showEditModal = false;
  editingCourse: Course = {
    id: 0,
    name: '',
    description: '',
    teacherId: 0,
    credits: 0
  };
  
  newCourse = {
    name: '',
    description: '',
    teacherId: null as number | null,
    credits: 3
  };
  
  ngOnInit(): void {
    // Charger les cours depuis localStorage
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      this.courses = JSON.parse(savedCourses);
      this.filteredCourses = [...this.courses];
    } else {
      // Sauvegarder les cours initiaux dans localStorage
      localStorage.setItem('courses', JSON.stringify(this.courses));
    }
    
    // Charger les enseignants depuis localStorage
    this.loadTeachers();
  }
  
  loadTeachers(): void {
    const savedTeachers = localStorage.getItem('teachers');
    if (savedTeachers) {
      this.availableTeachers = JSON.parse(savedTeachers);
    } else {
      // Utiliser des enseignants par défaut si aucun n'est trouvé
      this.availableTeachers = [
        { id: 1, name: 'Dr. Robert Martin', email: 'r.martin@email.com', subject: 'Mathématiques', hireDate: '01/09/2015' },
        { id: 2, name: 'Mme. Marie Curie', email: 'm.curie@email.com', subject: 'Physique', hireDate: '15/10/2016' },
        { id: 3, name: 'M. Jean Molière', email: 'j.moliere@email.com', subject: 'Littérature', hireDate: '01/09/2014' },
        { id: 4, name: 'Mrs. Elizabeth Smith', email: 'e.smith@email.com', subject: 'Anglais', hireDate: '01/09/2018' },
        { id: 5, name: 'Dr. Jacques Dupont', email: 'j.dupont@email.com', subject: 'Histoire', hireDate: '01/09/2017' }
      ];
      
      // Sauvegarder les enseignants par défaut dans localStorage
      localStorage.setItem('teachers', JSON.stringify(this.availableTeachers));
    }
  }
  
  openAddForm(): void {
    // Réinitialiser le formulaire
    this.newCourse = {
      name: '',
      description: '',
      teacherId: null,
      credits: 3
    };
    
    this.showAddForm = true;
  }
  
  filterCourses(): Course[] {
    if (!this.searchTerm.trim()) {
      this.filteredCourses = [...this.courses];
      return this.filteredCourses;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredCourses = this.courses.filter(course => 
      course.name.toLowerCase().includes(term) || 
      course.description.toLowerCase().includes(term) ||
      this.getTeacherName(course.teacherId).toLowerCase().includes(term)
    );
    
    return this.filteredCourses;
  }
  
  truncateDescription(description: string): string {
    return description.length > 50 ? description.substring(0, 50) + '...' : description;
  }
  
  getTeacherName(teacherId: number | undefined): string {
    if (!teacherId) return 'Non assigné';
    
    const teacher = this.availableTeachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Enseignant inconnu';
  }
  
  addCourse(): void {
    if (!this.newCourse.teacherId) {
      alert('Veuillez sélectionner un enseignant');
      return;
    }
    
    const newId = Math.max(0, ...this.courses.map(c => c.id)) + 1;
    const newCourse: Course = {
      id: newId,
      name: this.newCourse.name,
      description: this.newCourse.description,
      teacherId: this.newCourse.teacherId,
      credits: this.newCourse.credits
    };
    
    this.courses.push(newCourse);
    this.filterCourses();
    
    // Sauvegarder dans localStorage
    localStorage.setItem('courses', JSON.stringify(this.courses));
    
    // Réinitialiser le formulaire
    this.newCourse = {
      name: '',
      description: '',
      teacherId: null,
      credits: 3
    };
    this.showAddForm = false;
  }
  
  viewCourse(course: Course): void {
    this.selectedCourse = course;
    this.showViewModal = true;
  }
  
  editCourse(course: Course): void {
    this.editingCourse = {...course};
    this.showEditModal = true;
  }
  
  updateCourse(): void {
    const index = this.courses.findIndex(c => c.id === this.editingCourse.id);
    
    if (index !== -1) {
      this.courses[index] = {...this.editingCourse};
      this.filterCourses();
      
      // Sauvegarder dans localStorage
      localStorage.setItem('courses', JSON.stringify(this.courses));
      
      this.showEditModal = false;
    }
  }
  
  deleteCourse(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      this.courses = this.courses.filter(course => course.id !== id);
      this.filterCourses();
      
      // Sauvegarder dans localStorage
      localStorage.setItem('courses', JSON.stringify(this.courses));
    }
  }
} 