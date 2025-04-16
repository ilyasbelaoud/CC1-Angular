import { Entity } from "./Entity";
import { Teacher } from "./Teacher";
import { Student } from "./Student";

export class Course implements Entity {
  constructor(
    public id: number,
    public name: string,
    public teacher: Teacher | null = null,
    public students: Student[] = []
  ) {}
}
