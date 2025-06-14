export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  clientId: string;
  clientName: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  exercises: ExerciseInPlan[];
}

export interface ExerciseInPlan {
  id: string;
  exerciseName: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  weight?: number;
  restTime?: number;
  notes?: string;
  order: number;
  day?: number;
  listName?: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  description?: string;
  image?: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  clientProfile?: {
    fitnessLevel: string;
    fitnessGoals: string[];
    weight: number | null;
    height: number | null;
  };
}