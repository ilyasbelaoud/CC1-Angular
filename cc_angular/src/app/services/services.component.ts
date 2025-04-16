import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  available: boolean;
  duration?: string;  // Durée optionnelle (pour les services comme le tutorat)
  schedule?: string;  // Horaire optionnel (pour les activités programmées)
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestion des services</h2>
      
      <div class="search-box">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          placeholder="Rechercher un service..." 
          (input)="filterServices()"
        >
      </div>
      
      <button class="btn btn-primary" (click)="showAddForm = true">Ajouter un service</button>
      
      <!-- Add Form -->
      <div *ngIf="showAddForm" class="form-container">
        <h3>Ajouter un nouveau service</h3>
        <form (submit)="addService()">
          <div class="form-group">
            <label for="name">Nom du service</label>
            <input type="text" id="name" [(ngModel)]="newService.name" name="name" required>
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" [(ngModel)]="newService.description" name="description" rows="3" required></textarea>
          </div>
          
          <div class="form-group">
            <label for="category">Catégorie</label>
            <select id="category" [(ngModel)]="newService.category" name="category" required (change)="updateFormFields()">
              <option value="restauration">Restauration</option>
              <option value="transport">Transport</option>
              <option value="hebergement">Hébergement</option>
              <option value="tutorat">Tutorat/Soutien scolaire</option>
              <option value="activite">Activités extrascolaires</option>
              <option value="loisirs">Loisirs</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="price">Prix (€)</label>
            <input type="number" id="price" [(ngModel)]="newService.price" name="price" min="0" step="0.01" required>
          </div>
          
          <!-- Champs spécifiques aux catégories -->
          <div *ngIf="newService.category === 'tutorat' || newService.category === 'activite'" class="form-group">
            <label for="duration">Durée</label>
            <input type="text" id="duration" [(ngModel)]="newService.duration" name="duration" placeholder="Ex: 1h par semaine, 2h par séance">
          </div>
          
          <div *ngIf="newService.category === 'activite'" class="form-group">
            <label for="schedule">Horaires</label>
            <input type="text" id="schedule" [(ngModel)]="newService.schedule" name="schedule" placeholder="Ex: Lundi et Jeudi 16h-18h">
          </div>
          
          <div class="form-group">
            <label for="available">Disponibilité</label>
            <div class="checkbox-wrapper">
              <input type="checkbox" id="available" [(ngModel)]="newService.available" name="available">
              <label for="available" class="checkbox-label">Service disponible</label>
            </div>
          </div>
          
          <div class="form-action">
            <button type="button" class="btn btn-secondary" (click)="showAddForm = false">Annuler</button>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
          </div>
        </form>
      </div>
      
      <!-- Filtres par catégorie -->
      <div class="category-filters">
        <span>Filtrer par catégorie:</span>
        <button class="btn-filter" [class.active]="activeFilter === 'all'" (click)="filterByCategory('all')">Tous</button>
        <button class="btn-filter" [class.active]="activeFilter === 'restauration'" (click)="filterByCategory('restauration')">Restauration</button>
        <button class="btn-filter" [class.active]="activeFilter === 'transport'" (click)="filterByCategory('transport')">Transport</button>
        <button class="btn-filter" [class.active]="activeFilter === 'hebergement'" (click)="filterByCategory('hebergement')">Hébergement</button>
        <button class="btn-filter" [class.active]="activeFilter === 'tutorat'" (click)="filterByCategory('tutorat')">Tutorat</button>
        <button class="btn-filter" [class.active]="activeFilter === 'activite'" (click)="filterByCategory('activite')">Activités</button>
        <button class="btn-filter" [class.active]="activeFilter === 'loisirs'" (click)="filterByCategory('loisirs')">Loisirs</button>
      </div>
      
      <div class="services-grid">
        <div class="service-card" *ngFor="let service of filteredServices">
          <div class="service-header">
            <h3>{{ service.name }}</h3>
            <span class="badge" [ngClass]="service.available ? 'badge-available' : 'badge-unavailable'">
              {{ service.available ? 'Disponible' : 'Non disponible' }}
            </span>
          </div>
          <p class="service-category">{{ getCategoryLabel(service.category) }}</p>
          <p class="service-price">{{ service.price }} €</p>
          <p *ngIf="service.duration" class="service-detail"><strong>Durée:</strong> {{ service.duration }}</p>
          <p *ngIf="service.schedule" class="service-detail"><strong>Horaires:</strong> {{ service.schedule }}</p>
          <p class="service-description">{{ service.description }}</p>
          <div class="actions">
            <button class="btn btn-view" (click)="viewService(service)">Voir</button>
            <button class="btn btn-edit" (click)="editService(service)">Modifier</button>
            <button class="btn btn-delete" (click)="deleteService(service.id)">Supprimer</button>
          </div>
        </div>
      </div>
      
      <!-- View Modal -->
      <div *ngIf="showViewModal" class="modal">
        <div class="modal-content">
          <span class="close" (click)="showViewModal = false">&times;</span>
          <h3>Détails du service</h3>
          <p><strong>Nom:</strong> {{ selectedService?.name }}</p>
          <p><strong>Catégorie:</strong> {{ getCategoryLabel(selectedService?.category || '') }}</p>
          <p><strong>Prix:</strong> {{ selectedService?.price }} €</p>
          <p *ngIf="selectedService?.duration"><strong>Durée:</strong> {{ selectedService?.duration }}</p>
          <p *ngIf="selectedService?.schedule"><strong>Horaires:</strong> {{ selectedService?.schedule }}</p>
          <p><strong>Disponibilité:</strong> {{ selectedService?.available ? 'Disponible' : 'Non disponible' }}</p>
          <p><strong>Description:</strong> {{ selectedService?.description }}</p>
        </div>
      </div>
      
      <!-- Edit Modal -->
      <div *ngIf="showEditModal" class="modal">
        <div class="modal-content">
          <span class="close" (click)="showEditModal = false">&times;</span>
          <h3>Modifier le service</h3>
          <form (submit)="updateService()">
            <div class="form-group">
              <label for="edit-name">Nom du service</label>
              <input type="text" id="edit-name" [(ngModel)]="editingService.name" name="name" required>
            </div>
            
            <div class="form-group">
              <label for="edit-description">Description</label>
              <textarea id="edit-description" [(ngModel)]="editingService.description" name="description" rows="3" required></textarea>
            </div>
            
            <div class="form-group">
              <label for="edit-category">Catégorie</label>
              <select id="edit-category" [(ngModel)]="editingService.category" name="category" required (change)="updateEditFormFields()">
                <option value="restauration">Restauration</option>
                <option value="transport">Transport</option>
                <option value="hebergement">Hébergement</option>
                <option value="tutorat">Tutorat/Soutien scolaire</option>
                <option value="activite">Activités extrascolaires</option>
                <option value="loisirs">Loisirs</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="edit-price">Prix (€)</label>
              <input type="number" id="edit-price" [(ngModel)]="editingService.price" name="price" min="0" step="0.01" required>
            </div>
            
            <!-- Champs spécifiques aux catégories -->
            <div *ngIf="editingService.category === 'tutorat' || editingService.category === 'activite'" class="form-group">
              <label for="edit-duration">Durée</label>
              <input type="text" id="edit-duration" [(ngModel)]="editingService.duration" name="duration" placeholder="Ex: 1h par semaine, 2h par séance">
            </div>
            
            <div *ngIf="editingService.category === 'activite'" class="form-group">
              <label for="edit-schedule">Horaires</label>
              <input type="text" id="edit-schedule" [(ngModel)]="editingService.schedule" name="schedule" placeholder="Ex: Lundi et Jeudi 16h-18h">
            </div>
            
            <div class="form-group">
              <label for="edit-available">Disponibilité</label>
              <div class="checkbox-wrapper">
                <input type="checkbox" id="edit-available" [(ngModel)]="editingService.available" name="available">
                <label for="edit-available" class="checkbox-label">Service disponible</label>
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
    .category-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      align-items: center;
    }
    .btn-filter {
      background-color: #ecf0f1;
      border: 1px solid #ddd;
      border-radius: 20px;
      padding: 0.3rem 0.8rem;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-filter.active {
      background-color: #3498db;
      color: white;
      border-color: #3498db;
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
    .checkbox-wrapper {
      display: flex;
      align-items: center;
    }
    .checkbox-wrapper input[type="checkbox"] {
      width: auto;
      margin-right: 0.5rem;
    }
    .checkbox-label {
      display: inline;
    }
    .form-action {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .service-card {
      background-color: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .service-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .service-card h3 {
      margin: 0;
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: bold;
    }
    .badge-available {
      background-color: #2ecc71;
      color: white;
    }
    .badge-unavailable {
      background-color: #e74c3c;
      color: white;
    }
    .service-category {
      color: #7f8c8d;
      margin-bottom: 0.5rem;
    }
    .service-price {
      font-weight: bold;
      color: #3498db;
      margin-bottom: 0.5rem;
    }
    .service-detail {
      color: #555;
      margin-bottom: 0.5rem;
    }
    .service-description {
      margin-bottom: 1rem;
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
export class ServicesComponent implements OnInit {
  services: Service[] = [
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
    },
    {
      id: 4,
      name: 'Cours de soutien en mathématiques',
      description: 'Tutorat individuel pour les élèves en difficulté en mathématiques',
      category: 'tutorat',
      price: 20.00,
      available: true,
      duration: '1h par semaine'
    },
    {
      id: 5,
      name: 'Club de théâtre',
      description: 'Activité extrascolaire pour développer les compétences en expression orale et théâtrale',
      category: 'activite',
      price: 15.00,
      available: true,
      duration: '2h par séance',
      schedule: 'Mercredi 14h-16h'
    },
    {
      id: 6,
      name: 'Préparation aux examens',
      description: 'Sessions intensives de préparation aux examens nationaux',
      category: 'tutorat',
      price: 25.00,
      available: true,
      duration: '2h par séance, 10 séances'
    },
    {
      id: 7,
      name: 'Club de football',
      description: 'Activité sportive encadrée par un professionnel',
      category: 'activite',
      price: 45.00,
      available: true,
      duration: '1h30 par séance',
      schedule: 'Mardi et Vendredi 17h-18h30'
    }
  ];
  
  filteredServices: Service[] = [...this.services];
  searchTerm = '';
  showAddForm = false;
  activeFilter = 'all';
  
  // View and edit properties
  showViewModal = false;
  selectedService: Service | null = null;
  
  showEditModal = false;
  editingService: Service = {
    id: 0,
    name: '',
    description: '',
    category: 'restauration',
    price: 0,
    available: true,
    duration: '',
    schedule: ''
  };
  
  newService = {
    name: '',
    description: '',
    category: 'restauration',
    price: 0,
    available: true,
    duration: '',
    schedule: ''
  };
  
  ngOnInit(): void {
    // Load services from localStorage
    const savedServices = localStorage.getItem('schoolServices');
    if (savedServices) {
      this.services = JSON.parse(savedServices);
      this.filteredServices = [...this.services];
    } else {
      // Save initial services to localStorage
      localStorage.setItem('schoolServices', JSON.stringify(this.services));
    }
  }
  
  filterServices(): void {
    if (!this.searchTerm.trim() && this.activeFilter === 'all') {
      this.filteredServices = [...this.services];
      return;
    }
    
    let filtered = this.services;
    
    // Appliquer le filtre de catégorie si ce n'est pas "all"
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(service => service.category === this.activeFilter);
    }
    
    // Appliquer le filtre de recherche si défini
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(term) || 
        service.description.toLowerCase().includes(term) ||
        this.getCategoryLabel(service.category).toLowerCase().includes(term)
      );
    }
    
    this.filteredServices = filtered;
  }
  
  filterByCategory(category: string): void {
    this.activeFilter = category;
    this.filterServices();
  }
  
  updateFormFields(): void {
    // Réinitialiser les champs spécifiques lors du changement de catégorie
    if (this.newService.category !== 'tutorat' && this.newService.category !== 'activite') {
      this.newService.duration = '';
      this.newService.schedule = '';
    }
  }
  
  updateEditFormFields(): void {
    // Réinitialiser les champs spécifiques lors du changement de catégorie
    if (this.editingService.category !== 'tutorat' && this.editingService.category !== 'activite') {
      this.editingService.duration = '';
      this.editingService.schedule = '';
    }
  }
  
  getCategoryLabel(category: string): string {
    switch(category) {
      case 'restauration': return 'Restauration';
      case 'transport': return 'Transport';
      case 'hebergement': return 'Hébergement';
      case 'tutorat': return 'Tutorat/Soutien scolaire';
      case 'activite': return 'Activités extrascolaires';
      case 'loisirs': return 'Loisirs';
      case 'autre': return 'Autre';
      default: return category;
    }
  }
  
  addService(): void {
    const newId = Math.max(0, ...this.services.map(s => s.id)) + 1;
    const newService: Service = {
      id: newId,
      name: this.newService.name,
      description: this.newService.description,
      category: this.newService.category,
      price: this.newService.price,
      available: this.newService.available
    };
    
    // Ajouter les champs optionnels si nécessaire
    if (this.newService.duration) {
      newService.duration = this.newService.duration;
    }
    
    if (this.newService.schedule) {
      newService.schedule = this.newService.schedule;
    }
    
    this.services.push(newService);
    this.filterServices(); // Réappliquer les filtres actifs
    
    // Save to localStorage
    localStorage.setItem('schoolServices', JSON.stringify(this.services));
    
    // Reset form
    this.newService = {
      name: '',
      description: '',
      category: 'restauration',
      price: 0,
      available: true,
      duration: '',
      schedule: ''
    };
    this.showAddForm = false;
  }
  
  viewService(service: Service): void {
    this.selectedService = service;
    this.showViewModal = true;
  }
  
  editService(service: Service): void {
    this.editingService = {
      ...service,
      duration: service.duration || '',
      schedule: service.schedule || ''
    };
    this.showEditModal = true;
  }
  
  updateService(): void {
    const index = this.services.findIndex(s => s.id === this.editingService.id);
    
    if (index !== -1) {
      this.services[index] = {...this.editingService};
      this.filterServices(); // Réappliquer les filtres actifs
      
      // Save to localStorage
      localStorage.setItem('schoolServices', JSON.stringify(this.services));
      
      this.showEditModal = false;
    }
  }
  
  deleteService(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      this.services = this.services.filter(service => service.id !== id);
      this.filterServices(); // Réappliquer les filtres actifs
      
      // Save to localStorage
      localStorage.setItem('schoolServices', JSON.stringify(this.services));
    }
  }
} 