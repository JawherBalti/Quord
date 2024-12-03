import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  url = "https://quord-api.vercel.app/comments/"

  getAuthHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  create(comment: {}) {
    return this.http.post(this.url + "create", comment, { headers: this.getAuthHeader() })
  }

}
