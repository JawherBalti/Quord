import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Author } from '../models/author.model';
import { switchMap, tap } from 'rxjs';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private _auth: AuthService, private imageService: ImageService) { }

  authorId: string = ""
  updateRes = {}
  author!: Author
  token: any
  isLoading: Boolean = true
  isLoadingImage: Boolean = false
  isEditingName: Boolean = false
  isEditingNameLoading: Boolean = false
  isEditingAbout: Boolean = false
  isEditingAboutLoading: Boolean = false

  fullname: { name: string, lastName: string } = {
    name: "",
    lastName: "",
  }

  about: string = ""
  oldImage: string = ""

  ngOnInit(): void {
    this.authorId = this._auth.getAuthorDataFromToken()._id
    this._auth.getById(this.authorId)
      .subscribe({
        next: (res) => {
          this.author = res
          this.fullname.name = res.name
          this.fullname.lastName = res.lastName
          this.about = res.about
          this.oldImage = res.image
          this.isLoading = false
        }, error: err => {
          console.log(err);
          this.isLoading = false

        }
      })
  }

  changeIsEditingName() {
    this.isEditingName = !this.isEditingName
  }

  changeIsEditingAbout() {
    this.isEditingAbout = !this.isEditingAbout
  }

  triggerFileUpload(): void {
    this.fileInput.nativeElement.click();
  }

  uploadProfilePicture(e: any): void {
    this.isLoadingImage = true
    const file = e.target.files[0]

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
          this.updateAuthorImage(data.secure_url)
        }
        this.isLoadingImage = false
      })
  }

  updateAuthorImage(imageUrl: string): void {
    this._auth.update(this.authorId, { image: imageUrl })
      .pipe(
        tap(() => console.log('Image updated successfully.')),
        switchMap(
          (res: any) => {
            this.author = res.author
            this.token = res.myToken
            localStorage.setItem("token", this.token)
            this._auth.updateUserData(res.author);
            // Extract the public ID and delete the image from cloudinary
            const publicId = this.imageService.getPublicIdFromUrl(this.oldImage);
            return this.imageService.deleteImage(publicId);
          }
        )
      ).subscribe({
        next: (res: any) => {
          console.log('Image deleted successfully:', res);
        },
        error: err => {
          console.error('Failed to upload image:', err);
        }
      });
  }

  updateAbout() {
    this.isEditingAboutLoading = true
    this._auth.update(this.authorId, { about: this.about })
      .subscribe({
        next: (res: any) => {
          this.author = res.author
          this.token = res.myToken
          this.isEditingAboutLoading = false
          if (!this.isEditingAboutLoading) {
            this.isEditingAbout = false
          }
          localStorage.setItem("token", this.token)
        },
        error: err => {
          console.log(err);
          this.isEditingAboutLoading = false
        }
      })
  }

  updateName() {
    this.isEditingNameLoading = true
    this._auth.update(this.authorId, { name: this.fullname.name, lastName: this.fullname.lastName })
      .subscribe({
        next: (res: any) => {
          this.author = res.author
          this.token = res.myToken
          this.isEditingNameLoading = false
          if (!this.isEditingNameLoading) {
            this.isEditingName = false
          }
          localStorage.setItem("token", this.token)
        },
        error: err => {
          console.log(err);
          this.isEditingNameLoading = false

        }
      })
  }
}
