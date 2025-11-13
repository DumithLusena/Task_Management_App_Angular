import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task, Category, TaskFilter } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { DashboardComponent } from "../dashboard/dashboard.component";
import { CommonModule } from '@angular/common';
import { TaskFormComponent } from '../task-form/task-form.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  imports: [DashboardComponent, TaskFormComponent, CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit, OnDestroy {

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  editingTask: Task | null = null;
  showForm: boolean = false;
  categories: Category[] = [];

  filter: TaskFilter = {
    searchTerm: '',
    category: '',
    priority: '',
    status: 'all'
  };

  sortBy: 'date' | 'priority' | 'title' = 'date';

  private sub?: any;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.categories = this.taskService.getCategories();
    this.sub = this.taskService.tasksChanged.subscribe(() => this.loadTasks());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe?.();
  }

  loadTasks() {
    this.tasks = this.taskService.getTasks();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredTasks = this.taskService.filterTasks(this.tasks, this.filter);
    this.sortTasks();
  }

  sortTasks() {
    this.filteredTasks.sort((a, b) => {
      if (this.sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (this.sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  }

  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id);
      this.loadTasks();
    }
  }

  toggleComplete(task: Task) {
    this.taskService.toggleTaskCompletion(task.id);
    this.loadTasks();
  }

  editTask(task: Task) {
    this.editingTask = { ...task };
    this.showForm = true;
  }

  saveTask(task: Task) {
    if (task.id) {
      this.taskService.updateTask(task);
    } else {
      this.taskService.addTask(task);
    }
    this.editingTask = null;
    this.showForm = false;
    this.loadTasks();
  }

  cancelEdit() {
    this.editingTask = null;
    this.showForm = false;
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.editingTask = null;
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }

  getCategoryColor(categoryName: string): string {
    const category = this.categories.find(c => c.name === categoryName);
    return category ? category.color : 'bg-gray-500';
  }

  getCategoryIcon(categoryName: string): string {
    const category = this.categories.find(c => c.name === categoryName);
    return category ? category.icon : '📌';
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}