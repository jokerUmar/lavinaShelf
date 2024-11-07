import { Container } from "@mui/material";
import BookList from "../components/BookList";

export default function Home() {
  return (
    <Container sx={{ padding: "13px" }} maxWidth="xl">
      <BookList />
    </Container>
  );
}
