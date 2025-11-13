import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TaskFormComponent } from './components/task-form/task-form.component';

export const routes: Routes = [
    {
        path: '',
        component: TaskFormComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
