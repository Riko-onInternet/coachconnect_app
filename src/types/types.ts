export interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: 'TRAINER';
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: 'CLIENT';
  clientProfile?: {
    fitnessLevel?: string;
    fitnessGoals?: any[];
    weight?: number;
    height?: number;
  };
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  receiverId: string;
  read: boolean;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: Date;
  data: {
    clientId: string; // Rimuoviamo il modificatore opzionale
    trainerId?: string;
    [key: string]: any;
  };
}