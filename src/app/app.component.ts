import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <header class="header">
        <h1>{{ title }}</h1>
        <nav class="main-nav">
          <ul>
            <li><a routerLink="/dashboard" routerLinkActive="active">Tableau de bord</a></li>
            <li><a routerLink="/students" routerLinkActive="active">Étudiants</a></li>
            <li><a routerLink="/teachers" routerLinkActive="active">Enseignants</a></li>
            <li><a routerLink="/courses" routerLinkActive="active">Cours</a></li>
            <li><a routerLink="/classrooms" routerLinkActive="active">Classes</a></li>
            <li><a routerLink="/grades" routerLinkActive="active">Notes</a></li>
            <li><a routerLink="/services" routerLinkActive="active">Services</a></li>
          </ul>
        </nav>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="footer">
        <p>&copy; 2023 Système de Gestion Scolaire</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .header {
      background-color: #f5f5f5;
      padding: 1rem;
    }
    .main-nav ul {
      display: flex;
      list-style: none;
      padding: 0;
      gap: 1rem;
    }
    .main-nav a {
      text-decoration: none;
      color: #333;
    }
    .main-nav a.active {
      font-weight: bold;
      color: #007bff;
    }
    .main-content {
      flex: 1;
      padding: 1rem;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 1rem;
      text-align: center;
    }
  `]
})
export class AppComponent {
  title = 'Système de Gestion Scolaire';
}
