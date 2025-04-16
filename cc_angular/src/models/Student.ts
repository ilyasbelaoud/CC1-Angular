import { Entity } from "./Entity";
import { Course } from "./Course";
import { Service } from "./Service";

export class Student implements Entity {
  constructor(
    public id: number,
    public name: string,
    public courseIds: number[] = [],
    public services: Service[] = [],
    public courses: Course[] = []
  ) {}
}
