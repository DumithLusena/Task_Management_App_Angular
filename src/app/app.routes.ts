import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
