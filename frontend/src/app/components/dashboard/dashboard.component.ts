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
  USERID: string | null ='';
  constructor(private cs:CommonService){}
  ngOnInit() {
    this.USERID = localStorage.getItem('id');
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
        this.tasks = res.filter((r: any) => {
        const projectAssignedMatch = r.selectedProject?.assignedTo?.includes(this.USERID);
        const createdByMatch = r.selectedProject?.createdBy?.id === this.USERID;

         return projectAssignedMatch || createdByMatch;
        });
        this.toBeDoneTasks = this.tasks.filter((t: any) => t.taskstatus === 'To Be Done');
        this.inProgressTasks = this.tasks.filter((t: any) => t.taskstatus === 'In Progress');
        this.completedTasks = this.tasks.filter((t: any) => t.taskstatus === 'Completed');
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
      }
    });
  }
}
