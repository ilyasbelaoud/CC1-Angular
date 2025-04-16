import { Resource } from "../../models/Resource";

export class ResourceManager {
  private static instance: ResourceManager | null = null;
  private resources: Resource[] = [];

  private constructor() {}

  public static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  public addResource(resource: Resource): void {
    this.resources.push(resource);
  }

  public getResources(): Resource[] {
    return this.resources;
  }
  
  public getAllResources(): Resource[] {
    return this.getResources();
  }

  public getResourcesByType(type: string): Resource[] {
    return this.resources.filter(r => r.type === type);
  }
  
  public updateResource(resource: Resource): boolean {
    const index = this.resources.findIndex(r => r.id === resource.id);
    if (index !== -1) {
      this.resources[index] = resource;
      return true;
    }
    return false;
  }
  
  public deleteResource(id: number): boolean {
    const index = this.resources.findIndex(r => r.id === id);
    if (index !== -1) {
      this.resources.splice(index, 1);
      return true;
    }
    return false;
  }
  
  public getAvailableResources(): Resource[] {
    return this.resources.filter(r => r.quantity && r.quantity > 0);
  }
  
  public allocateResource(resourceId: number, quantity: number = 1): boolean {
    const resource = this.resources.find(r => r.id === resourceId);
    if (resource && resource.quantity && resource.quantity >= quantity) {
      resource.quantity -= quantity;
      return true;
    }
    return false;
  }
  
  public releaseResource(resourceId: number, quantity: number = 1): boolean {
    const resource = this.resources.find(r => r.id === resourceId);
    if (resource) {
      if (!resource.quantity) resource.quantity = 0;
      resource.quantity += quantity;
      return true;
    }
    return false;
  }
}
