import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from '../models/article.module';
import { Observable } from 'rxjs';
import { PaginatedArticles } from '../models/paginatedArticles.module';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }

  url = "http://localhost:3000/articles/"

  create(article: FormData) {
    return this.http.post(this.url + "create", article)
  }

  getAll(params?: { page: number, limit: number }): Observable<PaginatedArticles> {
    return this.http.get<PaginatedArticles>(this.url + "all", { params })
  }

  getArticleByAuthorId(id: string): Observable<Article> {
    return this.http.get<Article>(this.url + "getByAuthorId/" + id)
  }

  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(this.url + "getById/" + id)
  }

  likeArticle(id: string, userId: string): Observable<Article> {
    return this.http.post<Article>(this.url + "article/" + id + "/like", { userId })
  }

  dislikeArticle(id: string, userId: string): Observable<Article> {
    return this.http.post<Article>(this.url + "article/" + id + "/dislike", { userId })
  }
}
