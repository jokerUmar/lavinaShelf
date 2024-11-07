import { Stack } from "@mui/material";
import { useZustandStore } from "../lib/store";
import { useEffect } from "react";
import AddedBookCard from "./AddedBookCard";

export default function AddedBookList() {
  const { myBooks, setAddeditems } = useZustandStore();

  useEffect(() => {
    if (myBooks) {
      let tempArr: string[] = [];
      myBooks?.forEach((item) => {
        tempArr.push(item.book.isbn);
      });
      setAddeditems(tempArr);
    }
  }, [myBooks]);

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
      {myBooks?.map((item) => {
        return <AddedBookCard item={item} />;
      })}
    </Stack>
  );
}
