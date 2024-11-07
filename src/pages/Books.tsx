import { Container } from "@mui/material";
import { useEffect } from "react";
import { api } from "../lib/api";
import { useZustandStore } from "../lib/store";
import AddedBookList from "../components/AddedBookList";

export default function Books() {
  const { setMyBooks } = useZustandStore();

  const getMyBooks = async () => {
    try {
      let response = await api.get("/books");
      setMyBooks(response?.data);
    } catch (error) {}
  };

  useEffect(() => {
    getMyBooks();
  }, []);

  return (
    <Container sx={{ padding: "13px" }} maxWidth="xl">
      <AddedBookList />
    </Container>
  );
}
