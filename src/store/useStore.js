import { create } from "zustand";

export const useStore = create((set) => ({
  user: (() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  })(),
  posts: [],
  likes: {},
  comments: {},
  loading: false,
  error: null,

  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    set({ user });
  },

  setPosts: (posts) => set({ posts }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),

  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),

  setLikes: (postId, likesCount) => {
    set((state) => ({
      likes: { ...state.likes, [postId]: likesCount }
    }));
  },

  setComments: (postId, commentsArray) =>
    set((state) => ({
      comments: { ...state.comments, [postId]: commentsArray }
    })),
}));