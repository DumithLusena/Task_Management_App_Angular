import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TaskStatistics } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  statistics: TaskStatistics = {
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0,
    overdue: 0
  };
  private sub?: Subscription;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.sub = this.taskService.tasksChanged.subscribe(() => this.loadStatistics());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  loadStatistics(): void {
    this.statistics = this.taskService.getStatistics();
  }

  get completionRate(): number {
    return this.statistics.total > 0 
      ? Math.round((this.statistics.completed / this.statistics.total) * 100) 
      : 0;
  }
}

