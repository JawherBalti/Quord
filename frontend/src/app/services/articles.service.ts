import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getAuthHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  create(article: {}) {
    return this.http.post(this.url + "create", article, { headers: this.getAuthHeader() })
  }

  delete(id: string): Observable<Article> {
    return this.http.delete<Article>(this.url + "delete/" + id, { headers: this.getAuthHeader() })
  }

  update(id: string, article: any): Observable<Article> {
    return this.http.patch<Article>(this.url + "update/" + id, article)
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
    return this.http.post<Article>(this.url + "article/" + id + "/like", { userId }, { headers: this.getAuthHeader() })
  }

  dislikeArticle(id: string, userId: string): Observable<Article> {
    return this.http.post<Article>(this.url + "article/" + id + "/dislike", { userId }, { headers: this.getAuthHeader() })
  }
}
