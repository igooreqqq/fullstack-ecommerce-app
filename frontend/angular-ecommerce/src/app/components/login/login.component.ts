import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  isEmailValid = true;
  emailErrorMessage = '';
  loginError = false;
  formSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.setIsLoginPage(true);

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    this.formSubmitted = true; 

    this.isEmailValid = this.validateEmail();

    if (!this.isEmailValid || this.loginForm.invalid) {
      return; 
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe(
      (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['']);
      },
      (error) => {
        console.error('Login failed:', error);
        this.loginError = true;
      }
    );
  }
  validateEmail(): boolean {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!emailPattern.test(this.loginForm.get('email').value)) {
      this.isEmailValid = false;
      this.emailErrorMessage = 'Wrong email format!';
      return false;
    } else {
      this.isEmailValid = true;
      this.emailErrorMessage = '';
      return true;
    }
  }

  back(): void {
    this.authService.setIsLoginPage(false);
  }
}
