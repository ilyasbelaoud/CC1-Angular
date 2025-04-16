import { Student } from "../../models/Student";
import { Service } from "../../models/Service";

export abstract class StudentServiceDecorator {
  protected student: Student;
  protected service: Service;

  constructor(student: Student, service: Service) {
    this.student = student;
    this.service = service;
  }

  public getStudent(): Student {
    return this.student;
  }

  public getService(): Service {
    return this.service;
  }

  public abstract applyService(): void;
  public abstract removeService(): void;
} 