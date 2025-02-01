import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  router = inject(Router);
  http = inject(HttpClient);
  errorMessage: string = '';

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    fullName: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
  });

  onSignUp() {
    if (this.registerForm.valid) {
      const registerData = this.registerForm.value;

      this.http.post('http://localhost:5196/api/Account/register', registerData).subscribe(
          (res: any) => {
            alert('User registered successfully');
            this.router.navigateByUrl('/login');
          },
          (error) => {
            if (error.status === 400) {
              this.errorMessage = error.error || 'Registration failed!';
            } else if (error.status === 409) {
              this.errorMessage = error.error || 'Email is already registered.';
            } else {
              this.errorMessage = 'An unexpected error occurred.';
            }
            console.error('Error:', error);
          }
        );
    }
  }
}
