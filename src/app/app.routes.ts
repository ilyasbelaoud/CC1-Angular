import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent) 
  },
  { 
    path: 'students', 
    loadComponent: () => import('./students/students.component').then(c => c.StudentsComponent) 
  },
  { 
    path: 'teachers', 
    loadComponent: () => import('./teachers/teachers.component').then(c => c.TeachersComponent) 
  },
  { 
    path: 'courses', 
    loadComponent: () => import('./courses/courses.component').then(c => c.CoursesComponent) 
  },
  { 
    path: 'classrooms', 
    loadComponent: () => import('./classrooms/classrooms.component').then(c => c.ClassroomsComponent) 
  },
  { 
    path: 'grades', 
    loadComponent: () => import('./grades/grades.component').then(c => c.GradesComponent) 
  },
  { 
    path: 'services', 
    loadComponent: () => import('./services/services.component').then(c => c.ServicesComponent) 
  },
  { path: '**', redirectTo: '/dashboard' }
]; 