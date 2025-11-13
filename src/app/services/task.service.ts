import { Injectable } from '@angular/core';
import { Category, Task, TaskFilter, TaskStatistics } from '../models/task';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private storageKey = 'tasks';
  private categoriesKey = 'categories';

  private tasksChangedSubject = new Subject<void>();
  public tasksChanged = this.tasksChangedSubject.asObservable();

  private defaultCategories: Category[] = [
    { id: 1, name: 'Work', color: 'bg-blue-500', icon: '💼' },
    { id: 2, name: 'Personal', color: 'bg-green-500', icon: '🏠' },
    { id: 3, name: 'Shopping', color: 'bg-purple-500', icon: '🛒' },
    { id: 4, name: 'Health', color: 'bg-red-500', icon: '❤️' },
    { id: 5, name: 'Education', color: 'bg-yellow-500', icon: '📚' },
  ];

  constructor() {
    this.initializeCategories();
  }

  private initializeCategories(): void {
    if (!localStorage.getItem(this.categoriesKey)) {
      localStorage.setItem(this.categoriesKey, JSON.stringify(this.defaultCategories));
    }
  }

  getTasks(): Task[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private notifyChange(): void {
    this.tasksChangedSubject.next();
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    this.notifyChange();
  }

  addTask(task: Task): void {
    const tasks = this.getTasks();
    const now = new Date().toISOString();
    task.id = new Date().getTime();
    task.createdAt = now;
    task.updatedAt = now;
    tasks.push(task);
    this.saveTasks(tasks);
  }

  updateTask(updated: Task): void {
    updated.updatedAt = new Date().toISOString();
    const tasks = this.getTasks().map(t => t.id === updated.id ? updated : t);
    this.saveTasks(tasks);
  }

  deleteTask(id: number): void {
    const tasks = this.getTasks().filter(t => t.id !== id);
    this.saveTasks(tasks);
  }

  toggleTaskCompletion(id: number): void {
    const tasks = this.getTasks().map(t => {
      if (t.id === id) {
        return { ...t, completed: !t.completed, updatedAt: new Date().toISOString() };
      }
      return t;
    });
    this.saveTasks(tasks);
  }

  getCategories(): Category[] {
    const data = localStorage.getItem(this.categoriesKey);
    return data ? JSON.parse(data) : this.defaultCategories;
  }

  filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(filter.searchTerm.toLowerCase());
      const matchesCategory = !filter.category || task.category === filter.category;
      const matchesPriority = !filter.priority || task.priority === filter.priority;
      const matchesStatus = filter.status === 'all' ||
                          (filter.status === 'completed' && task.completed) ||
                          (filter.status === 'pending' && !task.completed);
      
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }

  getStatistics(): TaskStatistics {
    const tasks = this.getTasks();
    const now = new Date();
    
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length,
      overdue: tasks.filter(t => {
        if (!t.dueDate || t.completed) return false;
        return new Date(t.dueDate) < now;
      }).length
    };
  }
}

