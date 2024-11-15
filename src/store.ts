import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Artwork, Comment, Rating, User, Category } from './types';

const STORAGE_KEY = 'matrix-gallery-storage-v2';

interface StoreState {
  user: User | null;
  artworks: Artwork[];
  comments: Comment[];
  ratings: Rating[];
  categories: Category[];
  selectedArtwork: Artwork | null;
  selectedCategory: string | null;
  searchTerm: string;
  sessionId: string;
  currentPage: number;
  itemsPerPage: number;
  
  // Actions
  resetStore: () => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  
  // Auth actions
  login: (username: string, password: string) => void;
  logout: () => void;
  register: (username: string, password: string) => void;
  
  // Category actions
  addCategory: (category: Category) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  
  // Artwork actions
  setArtworks: (artworks: Artwork[]) => void;
  setComments: (comments: Comment[]) => void;
  setSelectedArtwork: (artwork: Artwork | null) => void;
  setSearchTerm: (term: string) => void;
  addArtwork: (artwork: Artwork) => void;
  updateArtwork: (id: string, artwork: Partial<Artwork>) => void;
  deleteArtwork: (artworkId: string) => void;
  moveArtworkToCategory: (artworkId: string, categoryId: string | null) => void;
  
  // Comment actions
  addComment: (comment: Comment) => void;
  deleteComment: (commentId: string) => void;
  
  // Rating actions
  addRating: (artworkId: string, rating: number) => void;
  hasUserRated: (artworkId: string) => boolean;
  getAverageRating: (artworkId: string) => number;
  
  // Filters
  getUserArtworks: (userId: string) => Artwork[];
  getAnonymousArtworks: () => Artwork[];
  getCategoryArtworks: (categoryId: string) => Artwork[];
}

const initialState = {
  user: null,
  artworks: [],
  comments: [],
  ratings: [],
  categories: [],
  selectedArtwork: null,
  selectedCategory: null,
  searchTerm: '',
  sessionId: Math.random().toString(36).substring(7),
  currentPage: 1,
  itemsPerPage: 12,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      resetStore: () => {
        localStorage.removeItem(STORAGE_KEY);
        set(initialState);
      },

      setCurrentPage: (page) => set({ currentPage: page }),
      setItemsPerPage: (count) => set({ itemsPerPage: count }),

      login: (username, password) => {
        set({ user: { id: Date.now().toString(), username } });
      },

      logout: () => {
        set({ user: null });
      },

      register: (username, password) => {
        set({ user: { id: Date.now().toString(), username } });
      },

      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),

      updateCategory: (id, name) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, name } : c
          ),
          artworks: state.artworks.map(artwork => 
            artwork.categoryId === id 
              ? { ...artwork, categoryId: undefined }
              : artwork
          ),
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          artworks: state.artworks.map(artwork => 
            artwork.categoryId === id 
              ? { ...artwork, categoryId: undefined }
              : artwork
          ),
        })),

      setSelectedCategory: (categoryId) =>
        set({ selectedCategory: categoryId }),

      moveArtworkToCategory: (artworkId, categoryId) =>
        set((state) => ({
          artworks: state.artworks.map((artwork) =>
            artwork.id === artworkId
              ? { ...artwork, categoryId: categoryId || undefined }
              : artwork
          ),
        })),

      setArtworks: (artworks) => set({ artworks }),
      setComments: (comments) => set({ comments }),
      setSelectedArtwork: (artwork) => set({ selectedArtwork: artwork }),
      setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }), // Reset to first page on search

      addArtwork: (artwork) => 
        set((state) => ({ 
          artworks: [artwork, ...state.artworks],
          selectedArtwork: artwork
        })),

      updateArtwork: (id, artwork) =>
        set((state) => ({
          artworks: state.artworks.map((a) =>
            a.id === id ? { ...a, ...artwork } : a
          ),
          selectedArtwork: state.selectedArtwork?.id === id 
            ? { ...state.selectedArtwork, ...artwork }
            : state.selectedArtwork
        })),

      deleteArtwork: (artworkId) =>
        set((state) => ({
          artworks: state.artworks.filter((a) => a.id !== artworkId),
          comments: state.comments.filter((c) => c.artworkId !== artworkId),
          ratings: state.ratings.filter((r) => r.artworkId !== artworkId),
          selectedArtwork: state.selectedArtwork?.id === artworkId ? null : state.selectedArtwork
        })),

      addComment: (comment) =>
        set((state) => ({ comments: [...state.comments, comment] })),

      deleteComment: (commentId) =>
        set((state) => ({
          comments: state.comments.filter((c) => c.id !== commentId),
        })),

      addRating: (artworkId, rating) =>
        set((state) => {
          const sessionId = state.sessionId;
          const existingRatingIndex = state.ratings.findIndex(
            (r) => r.artworkId === artworkId && r.sessionId === sessionId
          );

          let newRatings;
          if (existingRatingIndex >= 0) {
            newRatings = [...state.ratings];
            newRatings[existingRatingIndex].rating = rating;
          } else {
            newRatings = [...state.ratings, { artworkId, rating, sessionId }];
          }

          return { ratings: newRatings };
        }),

      hasUserRated: (artworkId) => {
        const state = get();
        return state.ratings.some(
          (r) => r.artworkId === artworkId && r.sessionId === state.sessionId
        );
      },

      getAverageRating: (artworkId) => {
        const state = get();
        const artworkRatings = state.ratings.filter(
          (r) => r.artworkId === artworkId
        );
        if (artworkRatings.length === 0) return 0;
        const sum = artworkRatings.reduce((acc, r) => acc + r.rating, 0);
        return sum / artworkRatings.length;
      },

      getUserArtworks: (userId) => {
        const state = get();
        return state.artworks.filter(
          (a) => a.userId === userId && !a.isAnonymous
        );
      },

      getAnonymousArtworks: () => {
        const state = get();
        return state.artworks.filter((a) => a.isAnonymous);
      },

      getCategoryArtworks: (categoryId) => {
        const state = get();
        return state.artworks.filter((a) => a.categoryId === categoryId);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        artworks: state.artworks,
        comments: state.comments,
        ratings: state.ratings,
        categories: state.categories,
        sessionId: state.sessionId,
      }),
    }
  )
);