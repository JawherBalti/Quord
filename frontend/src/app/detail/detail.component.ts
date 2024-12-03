import { Component, ElementRef, ViewChild } from '@angular/core';
import { ArticlesService } from './../services/articles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Article } from '../models/article.module';
import { Author, AuthorFromToken } from '../models/author.model';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { ImageService } from '../services/image.service';
import { CommentsService } from '../services/comments.service';
import { DatePipe } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private datePipe: DatePipe, private router: Router, private route: ActivatedRoute, private commentService: CommentsService, private articleData: ArticlesService, private _auth: AuthService, private imageService: ImageService) { }

  id!: string | null
  currentUser!: AuthorFromToken
  article$!: Observable<Article>
  author$!: Observable<Author>
  errorMessage: string = ""
  isLoading = false

  title: string = ""
  oldImage: string = ""
  description: string = ""
  content: string = ""
  tag: string = ""
  tags: string[] = []
  commentsList: any[] | undefined = []

  comment: string = ""

  isLoadingImage: Boolean = false
  isEditingTitle: Boolean = false
  isEditingTitleLoading: Boolean = false
  isEditingDescription: Boolean = false
  isEditingDescriptionLoading: Boolean = false
  isEditingContent: Boolean = false
  isEditingContentLoading: Boolean = false
  isEditingTag: Boolean = false
  isEditingTagLoading: Boolean = false
  isEditingImageLoading: Boolean = false
  isCommentLoading: Boolean = false

  formatDate(timestamp: any): string | null {
    return this.datePipe.transform(new Date(timestamp), 'MMM d, y, h:mm:ss a');
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id")
    this.currentUser = this._auth.getAuthorDataFromToken();

    if (this.id)
      this.article$ = this.articleData.getArticleById(this.id)
        .pipe(
          tap((res: Article) => {
            this.title = res.title
            this.oldImage = res.image
            this.description = res.description
            this.content = res.content
            this.tags = res.tags
            this.commentsList = res.comments
            this.author$ = this._auth.getById(res.authorId._id).pipe(
              catchError(err => {
                return throwError(() => new Error(err))
              })
            )
          }),
          catchError(err => {
            this.errorMessage = err.message
            return throwError(() => new Error(err))

          })
        )
  }

  changeIsEditingTitle() {
    this.isEditingTitle = !this.isEditingTitle
  }

  changeIsEditingDescription() {
    this.isEditingDescription = !this.isEditingDescription
  }

  changeIsEditingContent() {
    this.isEditingContent = !this.isEditingContent
  }

  changeIsEditingTags() {
    this.isEditingTag = !this.isEditingTag
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
    if (this.tag && this.tags.length < 5) {
      this.tags.push(this.tag)
    }
    this.tag = ""
  }

  removeTag(index: number) {
    if (this.tags.length > 0) {
      this.tags.splice(index, 1)
    }
  }

  triggerFileUpload(): void {
    this.fileInput.nativeElement.click();
  }

  uploadArticleImage(articleId: string, e: any): void {
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
          this.updateArticleImage(articleId, data.secure_url)
        }
        this.isLoadingImage = false
      })
  }

  updateArticleImage(articleId: string, imageUrl: string): void {
    this.isEditingImageLoading = true;
    this.articleData.update(articleId, { image: imageUrl }).subscribe({
      next: (res) => {

        const publicId = this.imageService.getPublicIdFromUrl(this.oldImage);

        this.isEditingImageLoading = false;
        this.article$ = new Observable((observer) => {
          observer.next(res);
          observer.complete();
        })
        this.imageService.deleteImage(publicId).subscribe({
          next: res => {
            // Optional: Update the article$ observable if needed
            console.log(res)
          },
          error: err => {
            console.log(err);

          }
        })
      },
      error: (err) => {
        console.error('Error updating content:', err);
        this.isEditingDescriptionLoading = false;
      }
    });
  }

  updateTitle(id: string) {
    this.isEditingTitleLoading = true
    this.article$ = this.articleData.update(id, { title: this.title }).pipe(
      tap(res => {
        this.title = res.title
        this.isEditingTitleLoading = false
        this.isEditingTitle = false
      })
    )
  }

  updateDescription(id: string) {
    this.isEditingDescriptionLoading = true;
    this.articleData.update(id, { description: this.description }).subscribe({
      next: (res) => {
        this.description = res.description;
        this.isEditingDescriptionLoading = false;
        this.isEditingDescription = false;

        // Optional: Update the article$ observable if needed
        this.article$ = new Observable((observer) => {
          observer.next(res);
          observer.complete();
        });
      },
      error: (err) => {
        console.error('Error updating description:', err.error);
        this.isEditingDescriptionLoading = false;
      }
    });
  }

  updateContent(id: string) {
    this.isEditingContentLoading = true;
    this.articleData.update(id, { content: this.content }).subscribe({
      next: (res) => {
        this.description = res.content;
        this.isEditingContentLoading = false;
        this.isEditingContent = false;

        // Optional: Update the article$ observable if needed
        this.article$ = new Observable((observer) => {
          observer.next(res);
          observer.complete();
        });
      },
      error: (err) => {
        console.error('Error updating content:', err);
        this.isEditingDescriptionLoading = false;
      }
    });
  }

  updateTag(id: string) {
    this.isEditingTagLoading = true;
    this.articleData.update(id, {
      tags: this.tags.toString()
    }).subscribe({
      next: (res) => {
        this.tags = res.tags;
        this.isEditingTagLoading = false;
        this.isEditingTag = false;

        // Optional: Update the article$ observable if needed
        this.article$ = new Observable((observer) => {
          observer.next(res);
          observer.complete();
        });
      },
      error: (err) => {
        console.error('Error updating tags:', err);
        this.isEditingTagLoading = false;
      }
    });
  }

  deleteArticle(id: string, imageUrl: string) {
    this.isLoading = true
    // Delete the article first
    this.articleData.delete(id).pipe(
      tap(() => console.log('Article deleted successfully.')),
      //switchMap: Chains the two operations, ensuring the second only runs if the first succeeds.
      switchMap(() => {
        // Extract the public ID and delete the image from cloudinary
        const publicId = this.imageService.getPublicIdFromUrl(imageUrl);
        return this.imageService.deleteImage(publicId);
      })
    ).subscribe({
      next: (res) => {
        this.isLoading = false
        console.log('Image deleted successfully:', res);
        // Navigate to home after successful deletion
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false
        console.error('Error during deletion:', err);
      }
    });
  }

  createComment() {
    this.isCommentLoading = true

    const newComment = {
      content: this.comment,
      authorId: this.currentUser._id,
      articleId: this.id
    }

    const optimisticComment = {
      _id: crypto.randomUUID(), // Generate a unique ID for the mock comment
      content: this.comment,
      authorId: {
        _id: this.currentUser._id,
        name: this.currentUser.name,
        lastName: this.currentUser.lastName,
        image: this.currentUser.image
      },
      articleId: this.id,
      date: new Date()
    }


    this.commentService.create(newComment)
      .subscribe({
        next: res => {
          this.comment = ""
          this.commentsList?.unshift(optimisticComment)
          this.isCommentLoading = false
        },
        error: err => {
          console.log(err);
          this.comment = ""
          this.isCommentLoading = false
        }
      })
  }
}
