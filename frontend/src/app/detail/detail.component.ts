import { ArticlesService } from './../services/articles.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Article } from '../models/article.module';
import { Author } from '../models/author.model';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent {

  constructor(private route: ActivatedRoute, private articleData: ArticlesService, private _auth: AuthService) { }

  id!: string | null
  article$!: Observable<Article>
  author$!: Observable<Author>
  imageUrl = "http://localhost:3000/getImage/"
  errorMessage: string = ""


  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id")

    if (this.id)
      this.article$ = this.articleData.getArticleById(this.id)
        .pipe(
          tap((res: Article) => {
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

}
