import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-task-form',
  imports: [SharedModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  taskForm: FormGroup;
  mode: 'A' | 'E';
  projects: any[] = [];
  users: any[] = [];
  USERID: string | null = '';

  constructor(
    public dialogRef: MatDialogRef<TaskFormComponent>,
    private fb: FormBuilder,
    private cs: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.mode = data.mode;

    this.taskForm = this.fb.group({
      selectedProject: ['', Validators.required],
      taskAssignedTo: ['', Validators.required],
      taskName: ['', Validators.required],
      taskDescription: [''],
      taskstatus: 'To Be Done'
    });
  }

  ngOnInit() {
    this.USERID = localStorage.getItem('id');
    this.getAllProjects();
  }

  getAllProjects() {
    this.cs.getAll('projects').subscribe({
      next: (res: any) => {
        this.projects = res.projects.filter(
          (p: any) => p.createdBy.id === this.USERID
        );

        if (this.mode === 'E' && this.data.task) {
          const task = this.data.task;

          this.taskForm.patchValue({
            selectedProject: task.selectedProject?._id || '',
            taskName: task.taskName || '',
            taskDescription: task.taskDescription || '',
            taskstatus: task.taskstatus || 'To Be Done'
          });

          this.onProjectChange(task.selectedProject?._id, task.taskAssignedTo);
        }
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
      }
    });
  }

  onProjectChange(projectId: string, prefillUserId?: string) {
    const selected = this.projects.find((p) => p._id === projectId);
    if (selected) {
      this.users = selected.assignedTo || [];
      this.taskForm.patchValue({
        taskAssignedTo: prefillUserId || ''
      });
    }
  }

  // ✅ Compare function for select
  compareById(o1: any, o2: any): boolean {
    return o1 === o2;
  }

  onSubmit() {
    if (this.taskForm.invalid) return;

    const formValue = this.taskForm.value;

    if (this.mode === 'E') {
      this.cs.put('tasks', this.data.task._id, formValue).subscribe({
        next: () => {
          this.snackBar.open('Task updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update Task. Check backend connection or data.');
        }
      });
    } else {
      this.cs.post('tasks', formValue).subscribe({
        next: () => {
          this.snackBar.open('Task Created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Add error:', err);
          alert('Failed to add Task. Check backend or form data.');
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
