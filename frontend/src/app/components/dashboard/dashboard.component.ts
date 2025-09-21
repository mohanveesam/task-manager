import { Component } from '@angular/core';
import { MatCard } from "@angular/material/card";
import { SharedModule } from '../../shared/shared.module';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-dashboard',
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  projects : any[] = [];
  tasks : any[] = [];
  toBeDoneTasks : any[] = [];
  inProgressTasks : any[] = [];
  completedTasks : any[] = [];
  last: any;

  constructor(private cs:CommonService){}
  ngOnInit() {
    this.getAllProjects();
    this.getAllTasks();
  }
  getAllProjects(){
    this.cs.getAll('projects').subscribe({
      next: (res: any) => {
        this.projects = res.projects;   // ✅ assign projects to array
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
      }
    });
  }

  getAllTasks(){
    this.cs.getAll('tasks').subscribe({
      next: (res: any) => {
        this.tasks = res.tasks;   // ✅ assign projects to array
        this.toBeDoneTasks = this.tasks.filter(t => t.taskstatus === 'To Be Done');
        this.inProgressTasks = this.tasks.filter(t => t.taskstatus === 'In Progress');
        this.completedTasks = this.tasks.filter(t => t.taskstatus === 'Completed');
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
      }
    });
  }
}
