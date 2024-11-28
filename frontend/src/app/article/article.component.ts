import { Component, Input, OnInit } from '@angular/core';
import { ArticlesService } from '../services/articles.service';
import { AuthService } from '../services/auth.service';
import { Article } from '../models/article.module';
import { AuthorFromToken } from '../models/author.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article',  // Use this selector in the parent template
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'] // Add any styling here
})
export class ArticleComponent implements OnInit {
  constructor(private articlesData: ArticlesService, private _auth: AuthService, private router: Router) { }


  @Input() article!: Article; // Use any type or create a specific interface for the article
  imageUrl = "http://localhost:3000/getImage/";
  currentUser!: AuthorFromToken
  likesList!: { _id: string; name: string; lastName: string; image: string; }[] | undefined
  dislikesList!: { _id: string; name: string; lastName: string; image: string; }[] | undefined
  isLoggedIn: Boolean = false

  ngOnInit(): void {
    if (this._auth.isLoggedIn()) {
      this.isLoggedIn = true
      this.currentUser = this._auth.getAuthorDataFromToken();
    }

    this.likesList = this.article.likes
    this.dislikesList = this.article.dislikes
  }


  like(articleId: string) {
    if (this.currentUser && this.currentUser._id) {
      this.articlesData.likeArticle(articleId, this.currentUser._id).subscribe({
        next: res => {
          if (this.isLoggedIn) {
            if (this.dislikesList?.some(user => user._id === this.currentUser._id)) {
              const user = this.dislikesList?.find(user => user._id === this.currentUser._id)
              const userIdx = this.dislikesList.indexOf(user!)
              this.dislikesList.splice(userIdx, 1)

              this.likesList?.push({ _id: this.currentUser._id, name: this.currentUser.name, lastName: this.currentUser.lastName, image: this.currentUser.image })
            }
            else if (!this.likesList?.some(user => user._id === this.currentUser._id))
              this.likesList?.push({ _id: this.currentUser._id, name: this.currentUser.name, lastName: this.currentUser.lastName, image: this.currentUser.image })
            else {
              const user = this.likesList?.find(user => user._id === this.currentUser._id)
              const userIdx = this.likesList.indexOf(user!)
              this.likesList.splice(userIdx, 1)
            }
          } else {
            this.router.navigate(["/login"])
          }
        },
        error: err => {
          console.log(err);
        }
      })
    } else {
      this.router.navigate(['/login'])
    }
  }

  dislike(
    articleId: string
  ) {
    if (this.currentUser && this.currentUser._id) {
      this.articlesData.dislikeArticle(articleId, this.currentUser._id).subscribe({
        next: res => {
          if (this.likesList?.some(user => user._id === this.currentUser._id)) {
            const user = this.likesList?.find(user => user._id === this.currentUser._id)
            const userIdx = this.likesList.indexOf(user!)
            this.likesList.splice(userIdx, 1)

            this.dislikesList?.push({ _id: this.currentUser._id, name: this.currentUser.name, lastName: this.currentUser.lastName, image: this.currentUser.image })
          }
          else if (!this.dislikesList?.some(user => user._id === this.currentUser._id))
            this.dislikesList?.push({ _id: this.currentUser._id, name: this.currentUser.name, lastName: this.currentUser.lastName, image: this.currentUser.image })
          else {
            const user = this.dislikesList?.find(user => user._id === this.currentUser._id)
            const userIdx = this.dislikesList.indexOf(user!)
            this.dislikesList.splice(userIdx, 1)
          }
        },
        error: err => {
          console.log(err);

        }
      })
    } else {
      this.router.navigate(["/login"])
    }
  }

  didLikeArticle(userId: string): boolean | undefined {
    return this.likesList?.some((like: any) => like._id === userId);
  }

  didDislikeArticle(userId: string): boolean | undefined {
    return this.dislikesList?.some((like: any) => like._id === userId);
  }
}
