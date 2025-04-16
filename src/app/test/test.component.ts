import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  template: '<div>Hello World!</div>'
})
export class TestComponent {
  constructor() {
    console.log('TestComponent constructed');
  }
} 