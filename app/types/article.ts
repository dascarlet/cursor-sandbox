export interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export type ArticleInput = Omit<Article, 'id' | 'createdAt'>; 