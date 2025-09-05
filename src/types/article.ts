export interface User {
  id: string;
  username: string;
  email?: string;   // kalau nanti ada
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  content: string;
  imageUrl: string | null; // karena bisa null
  createdAt: string;
  updatedAt: string;
  category: Category;
  user?: User; // opsional
}

export interface ArticleResponse {
  data: Article[];
  total: number;
  page: number;
  limit: number;
}
