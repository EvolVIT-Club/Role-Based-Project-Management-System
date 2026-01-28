export type UserRole = 'admin' | 'manager' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  dateOfBirth: string;
  address: string;
  photoUrl: string;
  experience: number; // years
  currentWorkload: number; // percentage
}

export interface Project {
  id: string;
  name: string;
  description: string;
  managerId: string;
  memberIds: string[];
  status: 'planning' | 'in-progress' | 'completed';
  createdAt: string;
  progress: number; // 0-100
}

export interface Task {
  id: string;
  projectId: string;
  assignedTo: string;
  title: string;
  description: string;
  status: 'to-do' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  dueDate: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
