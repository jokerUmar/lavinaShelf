import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { api } from "../lib/api";
import { useState } from "react";
import { MyBooks } from "../lib/store/types";
import { useZustandStore } from "../lib/store";
import {
  Alert,
  Box,
  CardContent,
  CircularProgress,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AddedBookCard({ item }: { item?: MyBooks }) {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const { removeBook: zustandRemoveBook, editBook } = useZustandStore();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(item?.status);
  const openModal = () => setOpen(true);

  const closeModal = () => {
    if (!saveLoading) {
      setOpen(false);
      setStatus(item?.status);
    }
  };

  const [message, setMessage] = useState<{
    type: "success" | "error";
    visible: boolean;
    errMessage: string;
  }>({ type: "success", visible: false, errMessage: "" });

  const handleClose = () => {
    setMessage((prev) => ({ ...prev, visible: false }));
  };

  const removeBook = async (id: number) => {
    try {
      setLoading(true);
      await api.delete("/books/" + id);
      zustandRemoveBook(id);
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

  const changeStatus = async () => {
    try {
      setSaveLoading(true);
      await api.patch("/books/" + item?.book.id, { status: status });
      editBook(item?.book.id as number, status as number);
      setMessage((prev) => ({ ...prev, type: "success", visible: true }));
      closeModal();
    } catch (error: any) {
      setMessage({
        type: "error",
        visible: true,
        errMessage: error?.message || "Error",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(Number(event.target.value) as number);
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
          image={item?.book.cover}
        />

        <CardContent sx={{ minHeight: "100px" }}>
          <Typography gutterBottom variant="body2" component="div">
            {item?.book.title}
          </Typography>

          <Typography gutterBottom variant="body2" component="div">
            Status: {item?.status}
          </Typography>
        </CardContent>

        <CardActions>
          <Stack width="100%" flexDirection={"row"}>
            <Button
              disabled={loading}
              onClick={() => {
                removeBook(item?.book.id as number);
              }}
              color="error"
              variant="contained"
              fullWidth
              size="small"
            >
              {loading ? (
                <CircularProgress sx={{ color: "#000" }} size={21} />
              ) : (
                "delete book"
              )}
            </Button>
            <Button
              onClick={openModal}
              sx={{ marginLeft: 1 }}
              variant="contained"
            >
              edit
            </Button>
          </Stack>
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

      <Modal
        open={open}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Select
            sx={{ width: "100%" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={String(status)}
            label="select"
            onChange={handleChange}
          >
            <MenuItem value={"0"}>0</MenuItem>
            <MenuItem value={"1"}>1</MenuItem>
            <MenuItem value={"2"}>2</MenuItem>
          </Select>
          <Button onClick={changeStatus} fullWidth sx={{ marginTop: "13px" }}>
            {saveLoading ? (
              <CircularProgress sx={{ color: "#000" }} size={21} />
            ) : (
              "save"
            )}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
