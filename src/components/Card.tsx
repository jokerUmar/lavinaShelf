import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { api } from "../lib/api";
import { useState } from "react";
import { IBooks } from "../lib/store/types";
import {
  Alert,
  CardContent,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import { useZustandStore } from "../lib/store";

export default function BookCard({ item }: { item?: IBooks }) {
  const [loading, setLoading] = useState(false);
  const { addBook: zustandAddBook } = useZustandStore();

  const [message, setMessage] = useState<{
    type: "success" | "error";
    visible: boolean;
    errMessage: string;
  }>({ type: "success", visible: false, errMessage: "" });

  const handleClose = () => {
    setMessage((prev) => ({ ...prev, visible: false }));
  };

  const addBook = async (isbn: string) => {
    try {
      setLoading(true);
      await api.post("/books", {
        isbn: isbn,
      });
      zustandAddBook(isbn);
      setMessage((prev) => ({ ...prev, type: "success", visible: true }));
    } catch (error: any) {
      setMessage({
        type: "error",
        visible: true,
        errMessage: error?.message || "Error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Card
        sx={{
          "@media (max-width: 500px)": {
            width: "95%",
          },
          "@media (min-width: 500px)": {
            width: "45%",
          },
          "@media (min-width: 900px)": {
            width: "23%",
          },
          "@media (min-width: 1180px)": {
            width: "18%",
          },
        }}
      >
        <CardMedia
          sx={{ padding: "13px" }}
          component="img"
          alt="green iguana"
          height="150"
          image={item?.cover}
        />

        <CardContent sx={{ minHeight: "100px" }}>
          <Typography gutterBottom variant="body2" component="div">
            {item?.title}
          </Typography>
        </CardContent>

        <CardActions>
          <Button
            disabled={loading || item?.isAdded}
            onClick={() => {
              addBook(item?.isbn as string);
            }}
            variant="contained"
            fullWidth
            size="small"
          >
            {loading ? (
              <CircularProgress sx={{ color: "#fff" }} size={21} />
            ) : (
              <>{item?.isAdded ? "Added" : "Add Book"}</>
            )}
          </Button>
        </CardActions>
      </Card>

      <Snackbar
        open={message.visible}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={message.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message.type === "error" ? message.errMessage : "Success"}
        </Alert>
      </Snackbar>
    </>
  );
}
