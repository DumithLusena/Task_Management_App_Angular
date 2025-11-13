export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  tags: string[];
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
}

export interface TaskFilter {
  searchTerm: string;
  category: string;
  priority: string;
  status: 'all' | 'completed' | 'pending';
}

export interface TaskStatistics {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
  overdue: number;
}
