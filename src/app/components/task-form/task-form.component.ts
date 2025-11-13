import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task, Category } from '../../models/task';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {

  @Input() task: Task = this.getEmptyTask();
  @Output() save = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  categories: Category[] = [];
  tagInput: string = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.categories = this.taskService.getCategories();
  }

  getEmptyTask(): Task {
    return {
      id: 0,
      title: '',
      description: '',
      completed: false,
      priority: 'medium',
      category: '',
      tags: [],
      dueDate: null,
      createdAt: '',
      updatedAt: ''
    };
  }

  onSubmit() {
    if (this.task.title.trim()) {
      this.save.emit({ ...this.task });
      this.task = this.getEmptyTask();
      this.tagInput = '';
    } else {
      alert('Title is required!');
    }
  }

  addTag() {
    if (this.tagInput.trim() && !this.task.tags.includes(this.tagInput.trim())) {
      this.task.tags.push(this.tagInput.trim());
      this.tagInput = '';
    }
  }

  removeTag(tag: string) {
    this.task.tags = this.task.tags.filter(t => t !== tag);
  }

  onCancel() {
    this.cancel.emit();
    this.task = this.getEmptyTask();
    this.tagInput = '';
  }

  get isEditMode(): boolean {
    return this.task.id > 0;
  }
}