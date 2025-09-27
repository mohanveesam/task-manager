import { Component, Input, } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { ProjectsFormComponent } from '../projects-form/projects-form.component';
@Component({
  selector: 'app-projects-details',
  imports: [SharedModule],
  templateUrl: './projects-details.component.html',
  styleUrl: './projects-details.component.css'
})
export class ProjectsDetailsComponent {
  @Input() project: any;
  USERID: string | null ='';
  constructor(private cs: CommonService, private dialog: MatDialog) {}

  openForm(data: any = null): void {
    const dialogRef = this.dialog.open(ProjectsFormComponent, {
      width: '1000px',
      data: {
        mode: data ? 'E' : 'A', // 'E' for Edit, 'A' for Add
        project: data || null,
      },
    });


  dialogRef.afterClosed().subscribe((updatedProject) => {
    if (updatedProject) {
      this.project = { ...updatedProject }; 
    }
  });
  }
  getProjectDetails(id: any) {
    this.cs.getAll(`projects/${id}`).subscribe({
      next: (res: any) => {
        this.project = { ...res };
      },
      error: (err) => {
        console.error('Failed to fetch employee details:', err);
      },
    });
  }
  deleteProject(id: string): void {
  if (confirm('Are you sure you want to delete this project?')) {
    this.cs.delete('projects', id).subscribe({
      next: (res) => {
        console.log('Delete successful:', res);
      },
      error: (err) => {
        console.error('Delete failed:', err);
        alert('Failed to delete project.');
      }
    });
  }
  }
  ngOnInit() {
    this.USERID = localStorage.getItem('id');
  }
}
