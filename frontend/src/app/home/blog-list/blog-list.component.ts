import { Component } from '@angular/core';
import { ArticlesService } from '../../services/articles.service';
import { Article } from 'src/app/models/article.module';
import { PaginatedArticles } from 'src/app/models/paginatedArticles.module';
import { BehaviorSubject, catchError, map, Observable, scan, shareReplay, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent {
  constructor(private articlesData: ArticlesService) { }

  articles$!: Observable<Article[]>;
  imageUrl = "http://localhost:3000/getImage/";
  errorMessage!: string;
  page: number = 0;
  limit: number = 4;
  isLoading = false;
  totalArticles!: number
  loadedArticlesCount: number = 0;  // Track loaded articles count


  private loadMoreSubject = new BehaviorSubject<any>(null);
  loadMore$ = this.loadMoreSubject.asObservable();

  // We've introduced a BehaviorSubject called loadMoreSubject to trigger new data loads.
  // The loadMore$ observable is created from this subject and used as the source for our main articles$ observable.
  // We're using switchMap to cancel any ongoing requests when a new one is triggered.
  // The scan operator accumulates all fetched articles into a single array.


  ngOnInit(): void {
    this.articles$ = this.loadMore$.pipe(
      switchMap(() => this.fetchArticles(this.page, this.limit)),
      map((paginatedArticles: PaginatedArticles) => {
        this.isLoading = false;        
        this.totalArticles = paginatedArticles.totalArticles
        this.loadedArticlesCount += paginatedArticles.articles.length;  // Update loaded articles count
        return paginatedArticles.articles;
      }),
      scan((acc: Article[], curr: Article[]) => [...acc, ...curr], []),
      catchError(err => {
        this.isLoading = false;
        this.errorMessage = err.message;
        return throwError(() => new Error(err));
      }),
      shareReplay(1)  // Cache the observable to prevent multiple subscriptions
    );

    this.loadMore();
  }

  fetchArticles(page: number, limit: number): Observable<PaginatedArticles> {
    return this.articlesData.getAll({ page, limit });
  }

  loadMore(): void {
    if (!this.isLoading && this.loadedArticlesCount < this.totalArticles) {  // Check if more articles can be loaded
      this.isLoading = true;
      this.page++;
      this.loadMoreSubject.next(null);
    }
  }
}
