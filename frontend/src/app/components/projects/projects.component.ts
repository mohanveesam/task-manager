import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { ProjectsFormComponent } from './projects-form/projects-form.component';
import { CommonService } from '../../services/common.service';
import { ProjectsDetailsComponent } from "./projects-details/projects-details.component";

@Component({
  selector: 'app-projects',
  imports: [SharedModule, ProjectsDetailsComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  projects : any[] = [];
  isShow : any =null;
  activeProjectId : number | null = null;
  selectedProject: any = null;
  selectedItem: any;
  constructor (private dialog: MatDialog, private cs: CommonService){

  }
  ngOnInit() {
    this.getAllProjects();
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
  openForm(data: any = null): void {
    const dialogRef = this.dialog.open(ProjectsFormComponent, {
      width: '1000px',
      data: {
      mode: data ? 'E' : 'A',   // 'E' for Edit, 'A' for Add
      project: data || null
    }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {this.getAllProjects()};
    });
  }
  selectProject(project: any){
    this.activeProjectId = project.id;
    this.selectedProject = project
    this.isShow =1
  }
  setActive(item: any) {
  this.selectedItem = item;
}
}
