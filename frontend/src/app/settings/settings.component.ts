import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Author } from '../models/author.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private _auth: AuthService) { }

  authorId: string = ""
  updateRes = {}
  author!: Author
  token: any
  imageUrl: string = "http://localhost:3000/getImage/"
  isLoading: Boolean = true
  isEditingName: Boolean = false
  isEditingNameLoading: Boolean = false
  isEditingAbout: Boolean = false
  isEditingAboutLoading: Boolean = false

  fullname: { name: string, lastName: string } = {
    name: "",
    lastName: "",
  }

  about: string = ""

  ngOnInit(): void {
    this.authorId = this._auth.getAuthorDataFromToken()._id
    this._auth.getById(this.authorId)
      .subscribe({
        next: (res) => {
          this.author = res
          this.fullname.name = res.name
          this.fullname.lastName = res.lastName
          this.about = res.about
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
    let formData = new FormData()
    const file = e.target.files[0]
    formData.append("image", file)

    if (file) {
      this.updateAuthorImage(formData)
    }
  }

  updateAuthorImage(formData: FormData): void {
    this._auth.update(this.authorId, formData)
      .subscribe({
        next: (res: any) => {
          this.author = res.author
          this.token = res.myToken
          localStorage.setItem("token", this.token)
          this._auth.updateUserData(res.author);
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
