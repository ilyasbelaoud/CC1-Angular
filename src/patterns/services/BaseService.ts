import { Entity } from "../../models/Entity";
import { Service } from "../../models/Service";
import { Student } from "../../models/Student";
import { CourseDao } from "../../dao/CourseDao";
import { Course } from "../../models/Course";
import { Teacher } from "../../models/Teacher";

// Base implementation of Service
export class BaseService implements Service {
  constructor(
    public id: number,
    public type: string,
    public name: string,
    public description: string
  ) {}

  applyToStudent(student: Student): void {
    // Base implementation only adds the service to the student's services
    if (!student.services.some(service => service.id === this.id)) {
      student.services.push(this);
    }
  }
} 