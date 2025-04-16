import { Entity } from "./Entity";
import { Student } from "./Student";

export interface Service extends Entity {
  type: string;
  name: string;
  description: string;
  applyToStudent(student: Student): void;
}
