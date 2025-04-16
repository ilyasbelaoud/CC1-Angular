import { Student } from "../../models/Student";
import { BaseService } from "./BaseService";

export class ArtsService extends BaseService {
  constructor(
    id: number,
    public artForm: string,
    public level: string
  ) {
    super(id, "Arts", artForm, `${artForm} activities at ${level} level`);
  }

  override applyToStudent(student: Student): void {
    super.applyToStudent(student);
    console.log(`Arts service for ${this.artForm} applied to student ${student.name}`);
    // Additional arts-specific logic here
  }
} 