import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';
import { TaskFormComponent } from './task-form/task-form.component';
import { MatCard } from "@angular/material/card";
import { SharedModule } from "../../shared/shared.module";
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-tasks',
  imports: [MatCard, SharedModule, MatDialogActions, MatDialogContent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  @ViewChild('statusPopup') statusPopup!: TemplateRef<any>;
  role: number | null = null;
  tasks : any[] = [];
  statusOptions: string[] = ["To Be Done", "In Progress", "Completed"];
  selectedTask: any = null;  // to hold which row is being edited
  selectedStatus: string = ""; // model for dropdown
  showStatusPopup: boolean = false; // control popup visibility
  USERID: string | null ='';
  
  constructor(private dialog : MatDialog, private cs: CommonService, private snackBar: MatSnackBar){

  }
  displayedColumns: string[] = ['projectName', 'projectCreator','creationDate', 'taskName', 'taskDescription', 'taskstatus', 'actions'];
  
  ngOnInit() {
    this.USERID = localStorage.getItem('id');
    this.role = Number(localStorage.getItem('role'));
    this.getAllTasks();
  }

  getAllTasks() {
    this.cs.getAll('tasks').subscribe((res: any) => {
     this.tasks = res.filter((r: any) => {
      const assignedToMatch = r.taskAssignedTo === this.USERID;
      const createdByMatch = r.selectedProject?.createdBy?.id === this.USERID;

      return assignedToMatch || createdByMatch;
    });

    });
  }
  
  openForm(data: any = null): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '400px',
      data: {
      mode: data ? 'E' : 'A',   // 'E' for Edit, 'A' for Add
      task: data || null
    }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getAllTasks();
    });
  }
  
  deleteTask(id: string): void {
  if (confirm('Are you sure you want to delete this Task?')) {
    this.cs.delete('tasks', id).subscribe({
      next: (res) => {
        this.snackBar.open('Task deleted successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        this.getAllTasks(); // Refresh the list
      },
      error: (err) => {
        this.snackBar.open('Task deleted Failed!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        alert('Failed to delete task.');
      }
    });
  }
  }

  openStatusPopup(task: any) {
  this.selectedTask = task;
  this.selectedStatus = task.taskstatus;

  this.dialog.open(this.statusPopup, {
    width: '300px'
  });
  }
  
  submitStatus() {
  if (!this.selectedTask) return;

  // Send only the status field (better than sending the whole object)
  const payload = { taskstatus: this.selectedStatus };

  this.cs.put("tasks", this.selectedTask._id, payload).subscribe({
    next: (res) => {
      // Update table instantly
      this.selectedTask.taskstatus = this.selectedStatus;
      this.closeStatusPopup();

      this.snackBar.open('Status updated successfully!', 'Close', { duration: 2000 });
    },
    error: (err) => {
      console.error('Error updating status:', err);
      this.snackBar.open('Failed to update status', 'Close', { duration: 2000 });
    }
  });
  }

  closeStatusPopup() {
  this.dialog.closeAll();
  }

}
