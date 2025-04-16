import { Entity } from "./Entity";

export class Resource implements Entity {
  constructor(
    public id: number,
    public name: string,
    public type: string, // 'classroom', 'equipment', 'supplies'
    public quantity: number = 1,
    public available: boolean = true
  ) {}
}
