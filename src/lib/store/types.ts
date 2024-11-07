export type User = {
  email: string;
  id: number;
  key: string;
  name: string;
  secret: string;
};

export type IBooks = {
  author: string;
  cover: string;
  isbn: string;
  published: number;
  title: string;
  isAdded: boolean;
};

export type MyBooks = {
  book: {
    author: string;
    cover: string;
    id: number;
    isbn: string;
    pages: number;
    published: number;
    title: string;
  };
  status: number;
};

export interface IStore {
  user: User | undefined;
  books: IBooks[] | undefined;
  addedBooks: string[];
  myBooks: MyBooks[] | undefined;

  setUser: (data: User | undefined) => void;
  setBooks: (data: IBooks[] | undefined) => void;
  setAddeditems: (data: string[]) => void;
  addBook: (data: string) => void;
  setMyBooks: (data: MyBooks[] | undefined) => void;
  removeBook: (id: number) => void;
  editBook: (id: number, status: number) => void;
}
