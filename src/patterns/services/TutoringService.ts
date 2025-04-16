import { Student } from "../../models/Student";
import { BaseService } from "./BaseService";

export class TutoringService extends BaseService {
  constructor(
    id: number,
    public subject: string,
    public hours: number
  ) {
    super(id, "Tutoring", `${subject} Tutoring`, `Tutoring in ${subject} for ${hours} hours`);
  }

  override applyToStudent(student: Student): void {
    super.applyToStudent(student);
    console.log(`Tutoring service for ${this.subject} applied to student ${student.name}`);
    // Additional tutoring-specific logic here
  }
} 