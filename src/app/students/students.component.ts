import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Student {
  id: number;
  name: string;
  email: string;
  class: string;
  enrollmentDate: string;
  serviceIds: number[];
}

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  available: boolean;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestion des étudiants</h2>
      
      <div class="search-box">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          placeholder="Rechercher un étudiant..." 
          (input)="filterStudents()"
        >
      </div>
      
      <button class="btn btn-primary" (click)="openAddForm()">Ajouter un étudiant</button>
      
      <div *ngIf="showAddForm" class="form-container">
        <h3>Ajouter un nouveau étudiant</h3>
        <form (submit)="addStudent()">
          <div class="form-group">
            <label for="name">Nom</label>
            <input type="text" id="name" [(ngModel)]="newStudent.name" name="name" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" [(ngModel)]="newStudent.email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="class">Classe</label>
            <input type="text" id="class" [(ngModel)]="newStudent.class" name="class" required>
          </div>
          
          <div class="form-group">
            <label>Services</label>
            <div class="services-selection">
              <div class="service-checkbox" *ngFor="let service of availableServices">
                <input 
                  type="checkbox" 
                  [id]="'service-' + service.id" 
                  [checked]="isServiceSelected(service.id)" 
                  (change)="toggleService(service.id)"
                >
                <label [for]="'service-' + service.id">
                  {{ service.name }} ({{ service.price }} €)
                </label>
              </div>
            </div>
          </div>
          
          <div class="form-action">
            <button type="button" class="btn btn-secondary" (click)="showAddForm = false">Annuler</button>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
          </div>
        </form>
      </div>
      
      <table class="students-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Classe</th>
            <th>Services</th>
            <th>Date d'inscription</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let student of filteredStudents">
            <td>{{ student.id }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.email }}</td>
            <td>{{ student.class }}</td>
            <td>
              <span *ngIf="getStudentServicesCount(student) === 0">Aucun service</span>
              <span *ngIf="getStudentServicesCount(student) > 0">
                {{ getStudentServicesNames(student) }}
              </span>
            </td>
            <td>{{ student.enrollmentDate }}</td>
            <td class="actions">
              <button class="btn btn-view" (click)="viewStudent(student)">Voir</button>
              <button class="btn btn-edit" (click)="editStudent(student)">Modifier</button>
              <button class="btn btn-delete" (click)="deleteStudent(student.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div *ngIf="showViewModal" class="modal">
        <div class="modal-content">
          <span class="close" (click)="showViewModal = false">&times;</span>
          <h3>Détails de l'étudiant</h3>
          <p><strong>ID:</strong> {{ selectedStudent?.id }}</p>
          <p><strong>Nom:</strong> {{ selectedStudent?.name }}</p>
          <p><strong>Email:</strong> {{ selectedStudent?.email }}</p>
          <p><strong>Classe:</strong> {{ selectedStudent?.class }}</p>
          <p><strong>Date d'inscription:</strong> {{ selectedStudent?.enrollmentDate }}</p>
          <div>
            <p><strong>Services:</strong></p>
            <ul *ngIf="selectedStudent && getStudentServicesCount(selectedStudent) > 0">
              <li *ngFor="let serviceName of getSelectedStudentServicesDetailList()">
                {{ serviceName }}
              </li>
            </ul>
            <p *ngIf="!selectedStudent || getStudentServicesCount(selectedStudent) === 0">
              Aucun service
            </p>
          </div>
        </div>
      </div>
      
      <div *ngIf="showEditModal" class="modal">
        <div class="modal-content">
          <span class="close" (click)="showEditModal = false">&times;</span>
          <h3>Modifier l'étudiant</h3>
          <form (submit)="updateStudent()">
            <div class="form-group">
              <label for="edit-name">Nom</label>
              <input type="text" id="edit-name" [(ngModel)]="editingStudent.name" name="name" required>
            </div>
            
            <div class="form-group">
              <label for="edit-email">Email</label>
              <input type="email" id="edit-email" [(ngModel)]="editingStudent.email" name="email" required>
            </div>
            
            <div class="form-group">
              <label for="edit-class">Classe</label>
              <input type="text" id="edit-class" [(ngModel)]="editingStudent.class" name="class" required>
            </div>
            
            <div class="form-group">
              <label>Services</label>
              <div class="services-selection">
                <div class="service-checkbox" *ngFor="let service of availableServices">
                  <input 
                    type="checkbox" 
                    [id]="'edit-service-' + service.id" 
                    [checked]="isEditingServiceSelected(service.id)" 
                    (change)="toggleEditingService(service.id)"
                  >
                  <label [for]="'edit-service-' + service.id">
                    {{ service.name }} ({{ service.price }} €)
                  </label>
                </div>
              </div>
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
    .services-selection {
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0.5rem;
    }
    .service-checkbox {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .service-checkbox input[type="checkbox"] {
      width: auto;
      margin-right: 0.5rem;
    }
    .form-action {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    .students-table {
      width: 100%;
      border-collapse: collapse;
    }
    .students-table th, 
    .students-table td {
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
export class StudentsComponent implements OnInit {
  students: Student[] = [
    { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', class: 'Terminal S', enrollmentDate: '05/09/2022', serviceIds: [1] },
    { id: 2, name: 'Marie Durand', email: 'marie.durand@email.com', class: 'Première ES', enrollmentDate: '06/09/2022', serviceIds: [1, 2] },
    { id: 3, name: 'Paul Martin', email: 'paul.martin@email.com', class: 'Seconde A', enrollmentDate: '04/09/2022', serviceIds: [] },
    { id: 4, name: 'Sophie Petit', email: 'sophie.petit@email.com', class: 'Terminal L', enrollmentDate: '05/09/2022', serviceIds: [3] },
    { id: 5, name: 'Lucas Bernard', email: 'lucas.bernard@email.com', class: 'Première S', enrollmentDate: '06/09/2022', serviceIds: [1, 3] }
  ];
  
  availableServices: Service[] = [];
  
  filteredStudents: Student[] = [...this.students];
  searchTerm = '';
  showAddForm = false;
  
  showViewModal = false;
  selectedStudent: Student | null = null;
  
  showEditModal = false;
  editingStudent: Student = {
    id: 0,
    name: '',
    email: '',
    class: '',
    enrollmentDate: '',
    serviceIds: []
  };
  
  newStudent = {
    name: '',
    email: '',
    class: '',
    serviceIds: [] as number[]
  };
  
  ngOnInit(): void {
    this.loadData();
  }
  
  loadData(): void {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      const parsedStudents = JSON.parse(savedStudents);
      
      this.students = parsedStudents.map((student: any) => ({
        ...student,
        serviceIds: student.serviceIds || []
      }));
      
      this.filteredStudents = [...this.students];
    } else {
      this.students = this.students.map(student => ({
        ...student,
        serviceIds: student.serviceIds || []
      }));
      
      localStorage.setItem('students', JSON.stringify(this.students));
    }
    
    const savedServices = localStorage.getItem('schoolServices');
    if (savedServices) {
      this.availableServices = JSON.parse(savedServices);
    } else {
      this.availableServices = [
        {
          id: 1,
          name: 'Cantine scolaire',
          description: 'Service de restauration pour les étudiants',
          category: 'restauration',
          price: 5.50,
          available: true
        },
        {
          id: 2,
          name: 'Transport scolaire',
          description: 'Service de transport entre le domicile et l\'établissement',
          category: 'transport',
          price: 30.00,
          available: true
        },
        {
          id: 3,
          name: 'Internat',
          description: 'Hébergement en internat pour les étudiants',
          category: 'hebergement',
          price: 250.00,
          available: true
        }
      ];
      
      localStorage.setItem('schoolServices', JSON.stringify(this.availableServices));
    }
  }
  
  openAddForm(): void {
    this.newStudent = {
      name: '',
      email: '',
      class: '',
      serviceIds: []
    };
    
    this.showAddForm = true;
  }
  
  filterStudents(): void {
    if (!this.searchTerm.trim()) {
      this.filteredStudents = [...this.students];
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredStudents = this.students.filter(student => 
      student.name.toLowerCase().includes(term) || 
      student.email.toLowerCase().includes(term) ||
      student.class.toLowerCase().includes(term)
    );
  }
  
  addStudent(): void {
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    const newId = Math.max(0, ...this.students.map(s => s.id)) + 1;
    const newStudent: Student = {
      id: newId,
      name: this.newStudent.name,
      email: this.newStudent.email,
      class: this.newStudent.class,
      enrollmentDate: formattedDate,
      serviceIds: [...this.newStudent.serviceIds]
    };
    
    this.students.push(newStudent);
    this.filteredStudents = [...this.students];
    
    localStorage.setItem('students', JSON.stringify(this.students));
    
    this.newStudent = {
      name: '',
      email: '',
      class: '',
      serviceIds: []
    };
    this.showAddForm = false;
  }
  
  viewStudent(student: Student): void {
    this.selectedStudent = student;
    this.showViewModal = true;
  }
  
  editStudent(student: Student): void {
    this.editingStudent = {
      ...student,
      serviceIds: [...(student.serviceIds || [])]
    };
    this.showEditModal = true;
  }
  
  updateStudent(): void {
    const index = this.students.findIndex(s => s.id === this.editingStudent.id);
    
    if (index !== -1) {
      this.students[index] = {...this.editingStudent};
      this.filteredStudents = [...this.students];
      
      localStorage.setItem('students', JSON.stringify(this.students));
      
      this.showEditModal = false;
    }
  }
  
  deleteStudent(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      this.students = this.students.filter(student => student.id !== id);
      this.filteredStudents = this.filteredStudents.filter(student => student.id !== id);
      
      localStorage.setItem('students', JSON.stringify(this.students));
    }
  }
  
  isServiceSelected(serviceId: number): boolean {
    return this.newStudent.serviceIds.includes(serviceId);
  }
  
  toggleService(serviceId: number): void {
    if (this.isServiceSelected(serviceId)) {
      this.newStudent.serviceIds = this.newStudent.serviceIds.filter(id => id !== serviceId);
    } else {
      this.newStudent.serviceIds.push(serviceId);
    }
  }
  
  isEditingServiceSelected(serviceId: number): boolean {
    return this.editingStudent.serviceIds.includes(serviceId);
  }
  
  toggleEditingService(serviceId: number): void {
    if (this.isEditingServiceSelected(serviceId)) {
      this.editingStudent.serviceIds = this.editingStudent.serviceIds.filter(id => id !== serviceId);
    } else {
      this.editingStudent.serviceIds.push(serviceId);
    }
  }
  
  getStudentServicesCount(student: Student): number {
    if (!student.serviceIds || student.serviceIds.length === 0) {
      return 0;
    }
    return student.serviceIds.length;
  }
  
  getStudentServicesNames(student: Student): string {
    if (!student.serviceIds || student.serviceIds.length === 0) {
      return 'Aucun service';
    }
    
    const serviceNames = student.serviceIds
      .map(id => {
        const service = this.availableServices.find(s => s.id === id);
        return service ? service.name : '';
      })
      .filter(name => name !== '');
    
    return serviceNames.join(', ');
  }
  
  getSelectedStudentServicesDetailList(): string[] {
    if (!this.selectedStudent || !this.selectedStudent.serviceIds || this.selectedStudent.serviceIds.length === 0) {
      return [];
    }
    
    return this.selectedStudent.serviceIds
      .map(id => {
        const service = this.availableServices.find(s => s.id === id);
        return service ? `${service.name} (${service.price} €)` : '';
      })
      .filter(name => name !== '');
  }
} 