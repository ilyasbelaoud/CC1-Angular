import { Student } from "../../models/Student";
import { BaseService } from "./BaseService";

export class SportsService extends BaseService {
  constructor(
    id: number,
    public sportName: string,
    public sessions: number
  ) {
    super(id, "Sport", sportName, `${sportName} activity for ${sessions} sessions`);
  }

  override applyToStudent(student: Student): void {
    super.applyToStudent(student);
    console.log(`Sports service for ${this.sportName} applied to student ${student.name}`);
    // Additional sports-specific logic here
  }
} 