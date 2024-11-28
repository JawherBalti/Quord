


import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  image: any
  isLoading: Boolean = false
  errorMessage!: string

  registerFormGroup!: FormGroup

  constructor(private _auth: AuthService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registerFormGroup = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      lastName: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(6)]),
      about: this.fb.control('', [Validators.required, Validators.minLength(30), Validators.maxLength(200)]),
      image: [null, Validators.required]
    });

    // Add custom validator for image field
    this.registerFormGroup.get('image')!.setValidators([
      Validators.required,
      this.validateImageSize.bind(this),
      this.validateImageType.bind(this)
    ]);
  }


  select(e: any) {
    const file = e.target.files[0];
    if (file) {
      this.registerFormGroup.patchValue({
        image: file
      });
    }
  }

  validateImageSize(control: FormControl): { [s: string]: boolean } | null {
    if (!control.value) {
      return null;
    }
    const file = control.value as File;
    if (file.size > 1024 * 1024) { // 1MB limit
      return { 'imageSize': true };
    }
    return null;
  }

  validateImageType(control: FormControl): { [s: string]: boolean } | null {
    if (!control.value) {
      return null;
    }
    const file = control.value
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return { 'imageType': true };
    }
    return null;
  }

  register() {
    this.isLoading = true;
    const formData = new FormData();

    Object.keys(this.registerFormGroup.controls).forEach(key => {

      const control = this.registerFormGroup.get(key);

      if (control && control.value !== null) {
        formData.append(key, control.value);
      }
    });

    this._auth.register(formData)
      .subscribe({
        next: res => {
          this.isLoading = false
          this.router.navigate(["/login"])
        },
        error: err => {
          this.isLoading = false
          if (err.status === 400)
            this.errorMessage = err.error
          else this.errorMessage = err.message
        }
      })
  }
}
