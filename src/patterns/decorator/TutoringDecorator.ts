import { StudentServiceDecorator } from "./StudentServiceDecorator";
import { Student } from "../../models/Student";
import { TutoringService } from "../services/TutoringService";

export class TutoringDecorator extends StudentServiceDecorator {
  private tutoringService: TutoringService;

  constructor(student: Student, service: TutoringService) {
    super(student, service);
    this.tutoringService = service;
  }

  public applyService(): void {
    if (!this.student.services.some(s => s.id === this.service.id)) {
      this.student.services.push(this.service);
      console.log(`Tutoring in ${this.tutoringService.subject} applied to ${this.student.name}`);
    }
  }

  public removeService(): void {
    const index = this.student.services.findIndex(s => s.id === this.service.id);
    if (index !== -1) {
      this.student.services.splice(index, 1);
      console.log(`Tutoring in ${this.tutoringService.subject} removed from ${this.student.name}`);
    }
  }
} 