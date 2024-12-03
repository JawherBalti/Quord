import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ArticlesService } from '../services/articles.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-createarticle',
  templateUrl: './createarticle.component.html',
  styleUrls: ['./createarticle.component.css']
})
export class CreatearticleComponent {
  constructor(private _auth: AuthService, private articles: ArticlesService, private router: Router, private fb: FormBuilder) { }
  tags: string[] = []
  image: any
  authorId = ""
  isLoading: Boolean = false

  createArticleFormGroup!: FormGroup


  ngOnInit(): void {
    this.createArticleFormGroup = this.fb.group({
      title: this.fb.control('', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
      description: this.fb.control('', [Validators.required, Validators.minLength(20), Validators.maxLength(200)]),
      content: this.fb.control('', [Validators.required, Validators.minLength(200)]),
      tag: this.fb.control(''),
      image: [null, Validators.required]
    });

    // Add custom validator for image field
    // this.createArticleFormGroup.get('image')!.setValidators([
    //   Validators.required,
    //   this.validateImageSize.bind(this),
    //   this.validateImageType.bind(this)
    // ]);
    this.authorId = this._auth.getAuthorDataFromToken()._id
  }

  // validateImageSize(control: FormControl): { [s: string]: boolean } | null {
  //   if (!control.value) {
  //     return null;
  //   }
  //   const file = control.value as File;
  //   if (file.size > 1024 * 1024) { // 1MB limit
  //     return { 'imageSize': true };
  //   }
  //   return null;
  // }

  // validateImageType(control: FormControl): { [s: string]: boolean } | null {
  //   if (!control.value) {
  //     return null;
  //   }
  //   const file = control.value
  //   const allowedTypes = ['image/jpeg', 'image/png'];
  //   if (!allowedTypes.includes(file.type)) {
  //     return { 'imageType': true };
  //   }
  //   return null;
  // }

  select(e: any) {
    const file = e.target.files[0];
    if (file) {
      this.createArticleFormGroup.patchValue({
        image: file
      });
    }
  }

  onFormKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission when pressing Enter in other fields
    }
  }

  // Handle tag input specifically to allow adding tag when Enter is pressed
  onTagKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      this.addTag(event); // Add the tag when Enter is pressed
    }
  }

  addTag(event: Event) {
    event.preventDefault();
    let tag = this.createArticleFormGroup.get("tag")?.value
    if (tag && this.tags.length < 5) {
      this.tags.push(tag)
    }
    this.createArticleFormGroup.get("tag")?.reset()
  }

  removeTag(index: number) {
    if (this.tags.length > 0) {
      this.tags.splice(index, 1)
    }
  }

  create() {
    this.isLoading = true;
    const file = this.createArticleFormGroup.get('image')?.value;

    // Cloudinary upload URL (use unsigned preset for this example)
    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dv1lhvgjr/upload';
    const formData = new FormData();
  
    // Add Cloudinary-specific parameters
    formData.append('file', file);
    formData.append('upload_preset', 'eiqxfhzq');
  
    // Upload to Cloudinary
    fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.secure_url) {
          // Add Cloudinary URL to the article data
          const articleData = {
            title:this.createArticleFormGroup.get('title')?.value,
            description:this.createArticleFormGroup.get('description')?.value,
            content:this.createArticleFormGroup.get('content')?.value,
            tags: this.tags.toString(),
            authorId:this.authorId,
            image: data.secure_url
          }
  
          // Save article to your backend
          this.articles.create(articleData).subscribe({
            next: res => {
              this.isLoading = false;
              this.router.navigate(['/home']);
            },
            error: err => {
              console.error(err);
              this.isLoading = false;
            },
          });
        } else {
          throw new Error('Image upload failed');
        }
      })
      .catch(err => {
        console.error(err);
        this.isLoading = false;
      });
  }
}