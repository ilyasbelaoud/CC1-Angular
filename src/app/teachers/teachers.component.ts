import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Teacher {
  id: number;
  name: string;
  email: string;
  subject: string;
  hireDate: string;
}

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestion des enseignants</h2>
      
      <div class="search-box">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          placeholder="Rechercher un enseignant..." 
          (input)="filterTeachers()"
        >
      </div>
      
      <button class="btn btn-primary" (click)="showAddForm = true">Ajouter un enseignant</button>
      
      <!-- Add Form -->
      <div *ngIf="showAddForm" class="form-container">
        <h3>Ajouter un nouvel enseignant</h3>
        <form (submit)="addTeacher()">
          <div class="form-group">
            <label for="name">Nom</label>
            <input type="text" id="name" [(ngModel)]="newTeacher.name" name="name" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" [(ngModel)]="newTeacher.email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="subject">Matière</label>
            <input type="text" id="subject" [(ngModel)]="newTeacher.subject" name="subject" required>
          </div>
          
          <div class="form-action">
            <button type="button" class="btn btn-secondary" (click)="showAddForm = false">Annuler</button>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
          </div>
        </form>
      </div>
      
      <table class="teachers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Matière</th>
            <th>Date d'embauche</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let teacher of filteredTeachers">
            <td>{{ teacher.id }}</td>
            <td>{{ teacher.name }}</td>
            <td>{{ teacher.email }}</td>
            <td>{{ teacher.subject }}</td>
            <td>{{ teacher.hireDate }}</td>
            <td class="actions">
              <button class="btn btn-view" (click)="viewTeacher(teacher)">Voir</button>
              <button class="btn btn-edit" (click)="editTeacher(teacher)">Modifier</button>
              <button class="btn btn-delete" (click)="deleteTeacher(teacher.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- View Modal -->
      <div *ngIf="showViewModal" class="modal">
        <div class="modal-content">
          <span class="close" (click)="showViewModal = false">&times;</span>
          <h3>Détails de l'enseignant</h3>
          <p><strong>ID:</strong> {{ selectedTeacher.id }}</p>
          <p><strong>Nom:</strong> {{ selectedTeacher.name }}</p>
          <p><strong>Email:</strong> {{ selectedTeacher.email }}</p>
          <p><strong>Matière:</strong> {{ selectedTeacher.subject }}</p>
          <p><strong>Date d'embauche:</strong> {{ selectedTeacher.hireDate }}</p>
        </div>
      </div>
      
      <!-- Edit Modal -->
      <div *ngIf="showEditModal" class="modal">
        <div class="modal-content">
          <span class="close" (click)="showEditModal = false">&times;</span>
          <h3>Modifier l'enseignant</h3>
          <form (submit)="updateTeacher()">
            <div class="form-group">
              <label for="edit-name">Nom</label>
              <input type="text" id="edit-name" [(ngModel)]="editingTeacher.name" name="name" required>
            </div>
            
            <div class="form-group">
              <label for="edit-email">Email</label>
              <input type="email" id="edit-email" [(ngModel)]="editingTeacher.email" name="email" required>
            </div>
            
            <div class="form-group">
              <label for="edit-subject">Matière</label>
              <input type="text" id="edit-subject" [(ngModel)]="editingTeacher.subject" name="subject" required>
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
    .form-group input {
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
    .teachers-table {
      width: 100%;
      border-collapse: collapse;
    }
    .teachers-table th, 
    .teachers-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
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
export class TeachersComponent {
  teachers = [
    { id: 1, name: 'Alexandre Martin', email: 'alexandre.martin@email.com', subject: 'Mathématiques', hireDate: '15/09/2018' },
    { id: 2, name: 'Émilie Dubois', email: 'emilie.dubois@email.com', subject: 'Français', hireDate: '10/09/2019' },
    { id: 3, name: 'Thomas Laurent', email: 'thomas.laurent@email.com', subject: 'Histoire-Géographie', hireDate: '01/09/2020' },
    { id: 4, name: 'Camille Robert', email: 'camille.robert@email.com', subject: 'Sciences Physiques', hireDate: '20/08/2017' },
    { id: 5, name: 'Nicolas Bernard', email: 'nicolas.bernard@email.com', subject: 'Anglais', hireDate: '05/09/2021' }
  ];
  
  filteredTeachers = [...this.teachers];
  searchTerm = '';
  showAddForm = false;
  
  // For teacher view
  showViewModal = false;
  selectedTeacher: Teacher | null = null;
  
  // For teacher edit
  showEditModal = false;
  editingTeacher = {
    id: 0,
    name: '',
    email: '',
    subject: '',
    hireDate: ''
  };
  
  newTeacher = {
    name: '',
    email: '',
    subject: ''
  };
  
  ngOnInit(): void {
    const savedTeachers = localStorage.getItem('teachers');
    if (savedTeachers) {
      this.teachers = JSON.parse(savedTeachers);
      this.filteredTeachers = [...this.teachers];
    }
  }
  
  filterTeachers(): Teacher[] {
    if (!this.searchTerm.trim()) {
      return [...this.teachers];
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    return this.teachers.filter(teacher => 
      teacher.name.toLowerCase().includes(term) || 
      teacher.email.toLowerCase().includes(term) ||
      teacher.subject.toLowerCase().includes(term)
    );
  }
  
  addTeacher(): void {
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    const newId = Math.max(0, ...this.teachers.map(t => t.id)) + 1;
    const newTeacher = {
      id: newId,
      name: this.newTeacher.name,
      email: this.newTeacher.email,
      subject: this.newTeacher.subject,
      hireDate: formattedDate
    };
    
    this.teachers.push(newTeacher);
    this.filteredTeachers = [...this.teachers];
    
    // Save to localStorage for persistence
    localStorage.setItem('teachers', JSON.stringify(this.teachers));
    
    // Reset form
    this.newTeacher = {
      name: '',
      email: '',
      subject: ''
    };
    this.showAddForm = false;
  }
  
  viewTeacher(teacher: Teacher): void {
    this.selectedTeacher = teacher;
    this.showViewModal = true;
  }
  
  editTeacher(teacher: Teacher): void {
    this.editingTeacher = {...teacher};
    this.showEditModal = true;
  }
  
  updateTeacher(): void {
    const index = this.teachers.findIndex(t => t.id === this.editingTeacher.id);
    
    if (index !== -1) {
      this.teachers[index] = {...this.editingTeacher};
      this.filteredTeachers = this.filterTeachers();
      
      // Save to localStorage
      localStorage.setItem('teachers', JSON.stringify(this.teachers));
      
      this.showEditModal = false;
    }
  }
  
  deleteTeacher(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      this.teachers = this.teachers.filter(teacher => teacher.id !== id);
      this.filteredTeachers = this.filteredTeachers.filter(teacher => teacher.id !== id);
      
      // Save to localStorage for persistence
      localStorage.setItem('teachers', JSON.stringify(this.teachers));
    }
  }
} 