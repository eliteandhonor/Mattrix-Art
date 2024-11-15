export interface User {
  id: string;
  username: string;
  isAnonymous?: boolean;
}

export interface Category {
  id: string;
  name: string;
  createdBy: string;
}

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  createdAt: string;
  userId: string;
  categoryId?: string;
  isAnonymous: boolean;
}

export interface Comment {
  id: string;
  artworkId: string;
  author: string;
  content: string;
  createdAt: string;
  userId?: string;
}

export interface Rating {
  artworkId: string;
  rating: number;
  sessionId: string;
}