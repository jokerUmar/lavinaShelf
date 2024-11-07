import { create } from "zustand";
import { IStore, User } from "./types";

const checkUser = () => {
  let user = localStorage.getItem("user") || undefined;
  if (user) {
    user = JSON.parse(user);
  }
  return user as User | undefined;
};

export const useZustandStore = create<IStore>((set) => ({
  user: checkUser(),
  books: undefined,
  addedBooks: [],
  myBooks: undefined,

  setUser: (data) => {
    set(() => ({ user: data }));
  },
  setBooks: (data) => {
    set(() => ({ books: data }));
  },
  addBook: (data) => {
    set((state) => ({
      addedBooks: [...state.addedBooks, data],
    }));
  },
  setAddeditems: (data) => {
    set(() => ({ addedBooks: data }));
  },
  setMyBooks: (data) => {
    set(() => ({ myBooks: data }));
  },

  removeBook: (id: number) =>
    set((state) => ({
      myBooks: state.myBooks?.filter((item) => item.book.id !== id),
    })),
  editBook: (id: number, status: number) =>
    set((state) => ({
      myBooks: state.myBooks?.map((item) =>
        item.book.id == id ? { ...item, status: status } : { ...item }
      ),
    })),
}));
