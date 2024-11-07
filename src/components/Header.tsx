import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useZustandStore } from "../lib/store";
import { CircularProgress } from "@mui/material";
import AppDrawer from "./Drawer";
import { useLocation } from "react-router";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const { setBooks } = useZustandStore();

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const fetchBooks = async (title: string) => {
    try {
      setSearchLoading(true);
      let response = await api.get(`/books/${title}`);
      setBooks(response?.data);
    } catch (error) {
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedValue) {
      fetchBooks(debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <>
      <AppDrawer toggleDrawer={toggleDrawer} opened={open} />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar component="nav" position="static">
          <Toolbar>
            <IconButton
              onClick={() => {
                toggleDrawer();
              }}
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              {location.pathname === "/home" ? "Home" : "My books"}
            </Typography>

            {location.pathname === "/home" ? (
              <Search>
                <SearchIconWrapper>
                  {searchLoading ? (
                    <CircularProgress size={20} sx={{ color: "#fff" }} />
                  ) : (
                    <SearchIcon />
                  )}
                </SearchIconWrapper>

                <StyledInputBase
                  value={inputValue}
                  onChange={handleChange}
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
            ) : null}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}
