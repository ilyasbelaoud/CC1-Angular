import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Classroom {
  id: number;
  name: string;
  capacity: number;
  building: string;
  floor: number;
  type: string;
}

@Component({
  selector: 'app-classrooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestion des classes</h2>
      
      <div class="search-box">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          placeholder="Rechercher une classe..." 
          (input)="filterClassrooms()"
        >
      </div>
      
      <button class="btn btn-primary" (click)="showAddForm = true">Ajouter une classe</button>
      
      <!-- Add Form -->
      <div *ngIf="showAddForm" class="form-container">
        <h3>Ajouter une nouvelle classe</h3>
        <form (submit)="addClassroom()">
          <div class="form-group">
            <label for="name">Nom de la classe</label>
            <input type="text" id="name" [(ngModel)]="newClassroom.name" name="name" required>
          </div>
          
          <div class="form-group">
            <label for="capacity">Capacité</label>
            <input type="number" id="capacity" [(ngModel)]="newClassroom.capacity" name="capacity" min="1" required>
          </div>
          
          <div class="form-group">
            <label for="building">Bâtiment</label>
            <input type="text" id="building" [(ngModel)]="newClassroom.building" name="building" required>
          </div>
          
          <div class="form-group">
            <label for="floor">Étage</label>
            <input type="number" id="floor" [(ngModel)]="newClassroom.floor" name="floor" required>
          </div>
          
          <div class="form-group">
            <label for="type">Type de salle</label>
            <select id="type" [(ngModel)]="newClassroom.type" name="type" required>
              <option value="standard">Salle standard</option>
              <option value="laboratory">Laboratoire</option>
              <option value="computer">Salle informatique</option>
              <option value="amphitheater">Amphithéâtre</option>
            </select>
          </div>
          
          <div class="form-action">
            <button type="button" class="btn btn-secondary" (click)="showAddForm = false">Annuler</button>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
          </div>
        </form>
      </div>
      
      <div class="classrooms-grid">
        <div class="classroom-card" *ngFor="let classroom of filteredClassrooms">
          <div class="classroom-header">
            <h3>{{ classroom.name }}</h3>
            <span class="badge" [ngClass]="'badge-' + classroom.type">{{ getTypeLabel(classroom.type) }}</span>
          </div>
          <p>Capacité: {{ classroom.capacity }} personnes</p>
          <p>Localisation: Bâtiment {{ classroom.building }}, Étage {{ classroom.floor }}</p>
          <div class="actions">
            <button class="btn btn-view" (click)="viewClassroom(classroom)">Voir</button>
            <button class="btn btn-edit" (click)="editClassroom(classroom)">Modifier</button>
            <button class="btn btn-delete" (click)="deleteClassroom(classroom.id)">Supprimer</button>
          </div>
        </div>
      </div>
      
      <!-- View Modal -->
      <div *ngIf="showViewModal" class="modal">
        <div class="modal-content">
          <span class="close" (click)="showViewModal = false">&times;</span>
          <h3>Détails de la classe</h3>
          <p><strong>ID:</strong> {{ selectedClassroom.id }}</p>
          <p><strong>Nom:</strong> {{ selectedClassroom.name }}</p>
          <p><strong>Type:</strong> {{ getTypeLabel(selectedClassroom.type) }}</p>
          <p><strong>Capacité:</strong> {{ selectedClassroom.capacity }} personnes</p>
          <p><strong>Bâtiment:</strong> {{ selectedClassroom.building }}</p>
          <p><strong>Étage:</strong> {{ selectedClassroom.floor }}</p>
        </div>
      </div>
      
      <!-- Edit Modal -->
      <div *ngIf="showEditModal" class="modal">
        <div class="modal-content">
          <span class="close" (click)="showEditModal = false">&times;</span>
          <h3>Modifier la classe</h3>
          <form (submit)="updateClassroom()">
            <div class="form-group">
              <label for="edit-name">Nom de la classe</label>
              <input type="text" id="edit-name" [(ngModel)]="editingClassroom.name" name="name" required>
            </div>
            
            <div class="form-group">
              <label for="edit-capacity">Capacité</label>
              <input type="number" id="edit-capacity" [(ngModel)]="editingClassroom.capacity" name="capacity" min="1" required>
            </div>
            
            <div class="form-group">
              <label for="edit-building">Bâtiment</label>
              <input type="text" id="edit-building" [(ngModel)]="editingClassroom.building" name="building" required>
            </div>
            
            <div class="form-group">
              <label for="edit-floor">Étage</label>
              <input type="number" id="edit-floor" [(ngModel)]="editingClassroom.floor" name="floor" required>
            </div>
            
            <div class="form-group">
              <label for="edit-type">Type de salle</label>
              <select id="edit-type" [(ngModel)]="editingClassroom.type" name="type" required>
                <option value="standard">Salle standard</option>
                <option value="laboratory">Laboratoire</option>
                <option value="computer">Salle informatique</option>
                <option value="amphitheater">Amphithéâtre</option>
              </select>
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
    .form-group input, .form-group select {
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
    .classrooms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .classroom-card {
      background-color: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .classroom-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: bold;
    }
    .badge-standard {
      background-color: #3498db;
      color: white;
    }
    .badge-laboratory {
      background-color: #2ecc71;
      color: white;
    }
    .badge-computer {
      background-color: #9b59b6;
      color: white;
    }
    .badge-amphitheater {
      background-color: #e74c3c;
      color: white;
    }
    .actions {
      margin-top: 1rem;
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
export class ClassroomsComponent {
  classrooms = [
    { id: 1, name: 'Salle 101', capacity: 30, building: 'A', floor: 1, type: 'standard' },
    { id: 2, name: 'Labo Physique', capacity: 20, building: 'B', floor: 2, type: 'laboratory' },
    { id: 3, name: 'Salle Info 03', capacity: 25, building: 'C', floor: 1, type: 'computer' },
    { id: 4, name: 'Amphi Descartes', capacity: 200, building: 'D', floor: 0, type: 'amphitheater' },
    { id: 5, name: 'Salle 205', capacity: 35, building: 'A', floor: 2, type: 'standard' }
  ];
  
  filteredClassrooms = [...this.classrooms];
  searchTerm = '';
  showAddForm = false;
  
  // View and edit properties
  showViewModal = false;
  selectedClassroom: Classroom | null = null;
  
  showEditModal = false;
  editingClassroom = {
    id: 0,
    name: '',
    capacity: 0,
    building: '',
    floor: 0,
    type: 'standard'
  };
  
  newClassroom = {
    name: '',
    capacity: 30,
    building: '',
    floor: 0,
    type: 'standard'
  };
  
  ngOnInit(): void {
    const savedClassrooms = localStorage.getItem('classrooms');
    if (savedClassrooms) {
      this.classrooms = JSON.parse(savedClassrooms);
      this.filteredClassrooms = [...this.classrooms];
    }
  }
  
  filterClassrooms(): Classroom[] {
    if (!this.searchTerm.trim()) {
      return [...this.classrooms];
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    return this.classrooms.filter(classroom => 
      classroom.name.toLowerCase().includes(term) || 
      classroom.building.toLowerCase().includes(term) ||
      this.getTypeLabel(classroom.type).toLowerCase().includes(term)
    );
  }
  
  getTypeLabel(type: string): string {
    switch(type) {
      case 'standard': return 'Salle standard';
      case 'laboratory': return 'Laboratoire';
      case 'computer': return 'Salle informatique';
      case 'amphitheater': return 'Amphithéâtre';
      default: return type;
    }
  }
  
  addClassroom(): void {
    const newId = Math.max(0, ...this.classrooms.map(c => c.id)) + 1;
    const newClassroom = {
      id: newId,
      name: this.newClassroom.name,
      capacity: this.newClassroom.capacity,
      building: this.newClassroom.building,
      floor: this.newClassroom.floor,
      type: this.newClassroom.type
    };
    
    this.classrooms.push(newClassroom);
    this.filteredClassrooms = [...this.classrooms];
    
    // Save to localStorage
    localStorage.setItem('classrooms', JSON.stringify(this.classrooms));
    
    // Reset form
    this.newClassroom = {
      name: '',
      capacity: 30,
      building: '',
      floor: 0,
      type: 'standard'
    };
    this.showAddForm = false;
  }
  
  viewClassroom(classroom: Classroom): void {
    this.selectedClassroom = classroom;
    this.showViewModal = true;
  }
  
  editClassroom(classroom: Classroom): void {
    this.editingClassroom = {...classroom};
    this.showEditModal = true;
  }
  
  updateClassroom(): void {
    const index = this.classrooms.findIndex(c => c.id === this.editingClassroom.id);
    
    if (index !== -1) {
      this.classrooms[index] = {...this.editingClassroom};
      this.filteredClassrooms = this.filterClassrooms();
      
      // Save to localStorage
      localStorage.setItem('classrooms', JSON.stringify(this.classrooms));
      
      this.showEditModal = false;
    }
  }
  
  deleteClassroom(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      this.classrooms = this.classrooms.filter(classroom => classroom.id !== id);
      this.filteredClassrooms = this.filteredClassrooms.filter(classroom => classroom.id !== id);
      
      // Save to localStorage
      localStorage.setItem('classrooms', JSON.stringify(this.classrooms));
    }
  }
} 