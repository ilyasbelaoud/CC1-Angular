import { Entity } from "./Entity";
import { Student } from "./Student";
import { Course } from "./Course";

export class Grade implements Entity {
  constructor(
    public id: number,
    public value: number,
    public description: string,
    public date: Date,
    public student: Student,
    public course: Course
  ) {}
} 