import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  invalidUserDetails = false;
  emailControl: FormControl;
  passwordControl : FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
   // private alertService : AlertService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'home';
  }

  get f(): any { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.login(this.f.email.value, this.f.password.value).subscribe(
        next => {
          this.loading = false;
          this.router.navigate([this.returnUrl]);
        },
        error => {
            alert(error);
            this.loading = false;
        });
  }
  redirectToRegister(){
    this.router.navigate(['register']);
  }

  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
  });
  this.emailControl = this.loginForm.get('email') as FormControl;
  this.passwordControl = this.loginForm.get('password') as FormControl;
  }

}
