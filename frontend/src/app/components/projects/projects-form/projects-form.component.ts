import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: 'app-projects-form',
  imports: [SharedModule],
  templateUrl: './projects-form.component.html',
  styleUrl: './projects-form.component.css'
})
export class ProjectsFormComponent implements OnInit {
  @Output() projectUpdated = new EventEmitter<any>(); // 👈 emitter
  mode: 'A' | 'E'; 
  projectForm : FormGroup;
  users: any[] = [];
  FULLNAME: string | null = '';
  ROLE: number | null = null;
  USERID: string | null ='';
  
  constructor(private dialogRef: MatDialogRef<ProjectsFormComponent>, 
  private fb:FormBuilder,private cs: CommonService,@Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar,){
    this.mode = data.mode;

    this.projectForm=this.fb.group({
      projectName: ['', Validators.required],
      projectDescription: [''],
      assignedTo: [[]] 
    })

    if (this.mode === 'E' && data.project) {
      //this.projectForm.patchValue(data.project);
      this.projectForm.patchValue({
    projectName: data.project.projectName,
    projectDescription: data.project.projectDescription,
    assignedTo: data.project.assignedTo.map((u: any) => u._id || u) // ensure IDs only
  });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.loadUser();
    // Fetch users for dropdown
    this.cs.getAll('users').subscribe((res: any) => {
      this.users = res; // expect { _id, fullName }
    });
    
  }
  loadUser() {
  this.FULLNAME = localStorage.getItem('fullname');
  this.ROLE = Number(localStorage.getItem('role'));
  this.USERID = localStorage.getItem('id');
  }
  
  onSubmit() {
    if (this.projectForm.invalid) return;
    const formValue =  {
        projectName: this.projectForm.value.projectName,
        projectDescription: this.projectForm.value.projectDescription,
        createdBy: {id: this.USERID, fullname: this.FULLNAME},
        assignedTo: this.projectForm.value.assignedTo // array of user IDs
      };


      if (this.mode === 'E') {
    this.cs
      .put('projects', this.data.project._id, formValue)
      .subscribe({
        next: () => {
          this.snackBar.open('project updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          });
          const assignedUsers = this.users.filter(user =>
              this.projectForm.value.assignedTo.includes(user._id)
          );
          const updatedProject = { 
          _id: this.data.project._id, 
          ...formValue, createdBy: this.data.project.createdBy, assignedTo: assignedUsers
          };
          this.dialogRef.close(updatedProject)
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update uesr. Check backend connection or data.');
        } 
      });
  } else {
    this.cs
      .post('projects', formValue)
      .subscribe({
        next: () => {
          this.snackBar.open('User Created successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          });
        // const assignedUsers = this.users.filter(user =>
        //   formValue.assignedTo.includes(user._id)
        //  );
        // const newProject = {
        //   _id: res._id,  
        //   ...formValue,
        //   createdBy: res.createdBy,
        //   assignedTo: assignedUsers
        // };
          this.dialogRef.close(true)
        },
        error: (err) => {
          console.error('Add error:', err);
          alert('Failed to add user. Check backend or form data.');
        },
        
      });
  }
  }
}
