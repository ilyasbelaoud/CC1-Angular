import { Entity } from "./Entity";
import { Student } from "./Student";
import { Teacher } from "./Teacher";
import { Course } from "./Course";

export class Classroom implements Entity {
  constructor(
    public id: number,
    public name: string,
    public capacity: number,
    public students: Student[] = [],
    public mainTeacher: Teacher | null = null,
    public courses: Course[] = []
  ) {}
} 