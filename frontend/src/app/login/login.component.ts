import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
typeof: any;
  constructor(private _auth: AuthService, private router: Router, private fb: FormBuilder) { }
  
  loginFormGroup!: FormGroup
  token: any
  isLoading: Boolean = false
  errorMessage!: string

ngOnInit(): void {
this.loginFormGroup = this.fb.group({
  email: this.fb.control("",[Validators.email, Validators.required]),
  password: this.fb.control("",[Validators.minLength(6), Validators.required])
})
}


  login() {
    this.isLoading = true
    this._auth.login(this.loginFormGroup.value)
      .subscribe({
        next: res => {
          localStorage.setItem("token", res.myToken)
          this._auth.updateUserData(res.author)
          this.router.navigate(["/home"])
          this.isLoading = false
        }, error: err => {
          this.isLoading = false
          if(err.status===400)
          this.errorMessage = err.error
        else this.errorMessage = err.message
        }
      })
  }
}