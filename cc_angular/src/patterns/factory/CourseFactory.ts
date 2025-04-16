import { Course } from "./../../models/Course";
import { Teacher } from "./../../models/Teacher";

// Factory Method pattern implementation
export class CourseFactory {
  public static createMathCourse(id: number, teacher: Teacher | null = null): Course {
    return new Course(id, "Mathematics", teacher);
  }

  public static createScienceCourse(id: number, teacher: Teacher | null = null): Course {
    return new Course(id, "Science", teacher);
  }

  public static createHistoryCourse(id: number, teacher: Teacher | null = null): Course {
    return new Course(id, "History", teacher);
  }

  public static createLanguageCourse(id: number, language: string, teacher: Teacher | null = null): Course {
    return new Course(id, `${language} Language`, teacher);
  }

  public static createArtCourse(id: number, teacher: Teacher | null = null): Course {
    return new Course(id, "Art", teacher);
  }

  public static createPhysicalEducationCourse(id: number, teacher: Teacher | null = null): Course {
    return new Course(id, "Physical Education", teacher);
  }
} 