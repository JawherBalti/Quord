import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { Author } from '../models/author.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) { }

  private url = "http://localhost:3000/author/"

  private userDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();

  updateUserData(userData: any) {
    this.userDataSubject.next(userData);
  }

  getAuthHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  register(author: { name: string, lastName: string, email: string, password: string, about: string, image: string }): Observable<Author> {
    return this.http.post<Author>(this.url + "register", author)
  }

  login(author: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(this.url + "login", author)
  }

  update(id: string, author: any) {
    return this.http.patch(this.url + "update/" + id, author, { headers: this.getAuthHeader() })
  }

  isLoggedIn() {
    let token = localStorage.getItem("token")
    if (token) return true
    else return false
  }

  getAuthorDataFromToken() {
    let token = localStorage.getItem("token")
    if (token) {
      let data = JSON.parse(window.atob(token.split(".")[1]))
      return data
    }
  }

  getById(id: string): Observable<Author> {
    return this.http.get<Author>(this.url + "getById/" + id)
  }
}
