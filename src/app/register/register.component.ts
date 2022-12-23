import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { MustMatch } from '../shared/form.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  emailControl: FormControl;
  passwordControl : FormControl;
  confirmPasswordControl: FormControl;
  usernameControl: FormControl;
  

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService) 
    {
      if (this.authService.isLoggedIn) {
        this.router.navigate(['/']);
      }
    }
     
  ngOnInit(): void {
    this.buildForm();
  }

  get f(): any { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    const userToCreate: User = {
      email: this.f.email.value,
      password: this.f.password.value,
      username: this.f.username.value
    };
    this.userService.createUser(userToCreate).subscribe({
      next: (createdUser) => {
        if(createdUser == null || createdUser == undefined) {
          alert("Something went wrong with user creation.");
          return;
        }
        this.authService.login(userToCreate.email, userToCreate.password!).subscribe({
          next: (loggedUser) =>{
            if(loggedUser == null || loggedUser == undefined) {
              alert("Something went wrong with user login.");
              return;
            }
            this.router.navigate(['']);
          },
          error: (err) => {
            alert(err.message);
            return;
          }
        })
      },
      error: (err) => {
        alert(err.message);
        return;
      }
    });
  }
  
  buildForm(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
  },{
    validator: MustMatch('password', 'confirm_password')
  });
  this.emailControl = this.f.email as FormControl;
  this.passwordControl = this.f.password as FormControl;
  this.confirmPasswordControl = this.f.confirm_password as FormControl;
  this.usernameControl = this.f.username as FormControl;
  }
}
