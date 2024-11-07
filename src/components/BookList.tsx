import { Stack } from "@mui/material";
import { useZustandStore } from "../lib/store";
import { useMemo } from "react";
import BookCard from "./Card";

export default function BookList() {
  const { books, addedBooks } = useZustandStore();

  const filtereditem = useMemo(() => {
    let response = books?.map((item) => {
      if (addedBooks?.includes(item.isbn)) {
        return { ...item, isAdded: true };
      } else {
        return { ...item, isAdded: false };
      }
    });
    return response;
  }, [books, addedBooks]);

  return (
    <Stack
      mt={3}
      flexGrow={1}
      gap={2}
      direction="row"
      justifyContent={"center"}
      useFlexGap
      sx={{ flexWrap: "wrap" }}
    >
      {filtereditem?.map((item) => {
        return <BookCard item={item} />;
      })}
    </Stack>
  );
}
