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
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  router = inject(Router);
  http = inject(HttpClient);
  errorMessage: string = '';


  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
  });

  onLogin() {
    this.http.post('http://localhost:5196/api/Account/login', this.loginForm.value).subscribe(
      (res: any) => {
        if (res && res.token) {
          localStorage.setItem('AngularToken', res.token);
          this.router.navigateByUrl('/dashboard');
        }
      },
      (error) => {
        if (error.status === 400) {
          this.errorMessage = error.error || 'Invalid credentials';
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
        console.error('Login Error:', error);
      }
    );
  }
}
