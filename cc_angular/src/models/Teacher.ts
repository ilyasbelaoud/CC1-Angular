import { Entity } from "./Entity";
import { Course } from "./Course";

export class Teacher implements Entity {
  constructor(
    public id: number,
    public name: string,
    public specialization: string,
    public assignedCourses: Course[] = []
  ) {}
}
