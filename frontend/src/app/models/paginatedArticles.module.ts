import { Article } from "./article.module"

export interface PaginatedArticles {
    totalArticles: number
    currentPage: number
    totalPages: number
    articles: Article[]
  }