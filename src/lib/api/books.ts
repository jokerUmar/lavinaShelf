import { api } from ".";

export const getBooks = async (title: string) => {
  try {
    let response = await api.get(`/books/${title}`);
    console.log(response, " response");
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
