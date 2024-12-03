import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from '../services/articles.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent {
  constructor(private _auth: AuthService, private articlesData: ArticlesService, private activeRoute: ActivatedRoute) { }

  id: any
  currentAutherId: any
  author: any
  articles: any
  isLoading: Boolean = true

  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.currentAutherId = this._auth.getAuthorDataFromToken()._id

    this.subscription.add(this.activeRoute.paramMap.subscribe(params => {
      this.id = params.get("id");
      this.fetchAuthorData();
      this.fetchArticlesByAuthorId();
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  fetchAuthorData() {
    this.isLoading = true;

    this._auth.getById(this.id)
      .subscribe({
        next: (res) => {
          this.author = res;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching author:', err);
          this.isLoading = false;
        }
      });
  }

  fetchArticlesByAuthorId() {
    this.articlesData.getArticleByAuthorId(this.id)
      .subscribe({
        next: res => {
          console.log(res);
          
          this.articles = res;
        },
        error: err => {
          console.error('Error fetching articles:', err);
        }
      });
  }
}

