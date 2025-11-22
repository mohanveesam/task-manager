import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { SharedModule } from '../../shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  imports: [SharedModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  token = '';
  username = '';
  message = '';
  error = '';
  success: any;

  constructor(private fb: FormBuilder, private cs: CommonService, private router: Router, private snackBar: MatSnackBar,) {
    this.resetForm = this.fb.group({
      username: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onReset() {
  if (this.resetForm.value.newPassword !== this.resetForm.value.confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  this.cs.resetPassword({
    username: this.resetForm.value.username,
    newPassword: this.resetForm.value.newPassword
  }).subscribe({
    next: () => {
      this.snackBar.open('Password Resetted successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          });
      // this.resetForm.reset();
       setTimeout(() => this.router.navigate(['/components/login']), 300);
    },
    error: (err) => {
      alert(err.error.message);
    }
  });
  }
}
