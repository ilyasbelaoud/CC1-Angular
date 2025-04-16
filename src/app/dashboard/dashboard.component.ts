import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <nav class="sidebar">
        <div class="logo">
          <h2>École Manager</h2>
        </div>
        <ul class="nav-links">
          <li><a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a></li>
          <li><a routerLink="/students" routerLinkActive="active">Étudiants</a></li>
          <li><a routerLink="/teachers" routerLinkActive="active">Enseignants</a></li>
          <li><a routerLink="/courses" routerLinkActive="active">Cours</a></li>
          <li><a routerLink="/classrooms" routerLinkActive="active">Classes</a></li>
          <li><a routerLink="/grades" routerLinkActive="active">Notes</a></li>
          <li><a routerLink="/services" routerLinkActive="active">Services</a></li>
        </ul>
      </nav>
      
      <main class="content">
        <div class="welcome-panel">
          <h1>Bienvenue dans l'application de gestion scolaire</h1>
          <p>Sélectionnez une option dans le menu pour commencer.</p>
        </div>
        
        <div class="dashboard-widgets">
          <div class="widget">
            <h3>Étudiants</h3>
            <p>Gérez les informations des étudiants</p>
            <a routerLink="/students" class="btn">Accéder</a>
          </div>
          
          <div class="widget">
            <h3>Enseignants</h3>
            <p>Gérez les informations des enseignants</p>
            <a routerLink="/teachers" class="btn">Accéder</a>
          </div>
          
          <div class="widget">
            <h3>Cours</h3>
            <p>Gérez les cours proposés</p>
            <a routerLink="/courses" class="btn">Accéder</a>
          </div>
          
          <div class="widget">
            <h3>Classes</h3>
            <p>Gérez les salles de classe</p>
            <a routerLink="/classrooms" class="btn">Accéder</a>
          </div>
          
          <div class="widget">
            <h3>Notes</h3>
            <p>Gérez les notes des étudiants</p>
            <a routerLink="/grades" class="btn">Accéder</a>
          </div>
          
          <div class="widget">
            <h3>Services</h3>
            <p>Gérez les services proposés aux étudiants</p>
            <a routerLink="/services" class="btn">Accéder</a>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      height: 100vh;
    }
    
    .sidebar {
      width: 250px;
      background-color: #2c3e50;
      color: white;
      padding: 20px 0;
      display: flex;
      flex-direction: column;
    }
    
    .logo {
      padding: 0 20px;
      margin-bottom: 20px;
    }
    
    .nav-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .nav-links li {
      padding: 0;
    }
    
    .nav-links a {
      display: block;
      padding: 15px 20px;
      color: #ecf0f1;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    .nav-links a:hover, .nav-links a.active {
      background-color: #34495e;
      color: #3498db;
    }
    
    .content {
      flex: 1;
      padding: 20px;
      background-color: #ecf0f1;
      overflow-y: auto;
    }
    
    .welcome-panel {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .dashboard-widgets {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .widget {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .widget h3 {
      margin-top: 0;
      color: #2c3e50;
    }
    
    .btn {
      display: inline-block;
      background-color: #3498db;
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }
    
    .btn:hover {
      background-color: #2980b9;
    }
  `]
})
export class DashboardComponent {
  // La logique du composant reste simple pour le dashboard
}
