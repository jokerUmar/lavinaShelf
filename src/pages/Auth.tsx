import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  CircularProgress,
} from "@mui/material";
import { api } from "../lib/api";
import { useZustandStore } from "../lib/store";
import { generateMD5Hash } from "../utils/additionalFunctions";
import { useNavigate } from "react-router";

interface FormState {
  name: string;
  email: string;
  mySecret: string;
  myKey: string;
}

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useZustandStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    mySecret: "",
    myKey: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const validate = (): boolean => {
    let validationErrors: Partial<FormState> = {};

    if (!form.mySecret) {
      validationErrors.mySecret = "MySecret is required";
    }
    if (!form.myKey) {
      validationErrors.myKey = "MyKey is required";
    }

    if (isSignUp) {
      if (!form.email) {
        validationErrors.email = "Email is required";
      } else if (!emailRegex.test(form.email)) {
        validationErrors.email = "Please enter a valid email";
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const signIn = async () => {
    try {
      setIsLoading(true);
      const { mySecret, myKey } = form;
      let response = await api.get("/myself", {
        headers: {
          Authorization: "basic",
          key: myKey,
          Sign: generateMD5Hash("GET/myself" + mySecret),
        },
      });
      localStorage.setItem("user", JSON.stringify(response?.data));
      setUser(response?.data);
    } catch (error: any) {
      alert(`error: ${error?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async () => {
    try {
      setIsLoading(true);

      const { mySecret, myKey, name, email } = form;

      let body = {
        email,
        name,
        key: myKey,
        secret: mySecret,
      };

      let response = await api.post("/signup", body, {
        headers: {
          Authorization: "basic",
        },
      });
      localStorage.setItem("user", JSON.stringify(response?.data));
      setUser(response?.data);
    } catch (error: any) {
      alert(`error: ${error?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (validate()) {
      if (isSignUp) {
        signUp();
      } else {
        signIn();
      }
    }
  };

  const toggleAuthMode = (): void => {
    setIsSignUp(!isSignUp);
    setForm({ name: "", email: "", mySecret: "", myKey: "" });
    setErrors({});
  };

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user]);

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt={8}
      >
        <Typography variant="h4" gutterBottom>
          {isSignUp ? "Sign Up" : "Sign In"}
        </Typography>

        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {isSignUp && (
            <>
              <TextField
                variant="outlined"
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                variant="outlined"
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                error={!!errors.email}
                helperText={errors.email}
              />
            </>
          )}
          <TextField
            variant="outlined"
            label="MySecret"
            name="mySecret"
            value={form.mySecret}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={!!errors.mySecret}
            helperText={errors.mySecret}
          />
          <TextField
            variant="outlined"
            label="MyKey"
            name="myKey"
            value={form.myKey}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={!!errors.myKey}
            helperText={errors.myKey}
          />
          <Button
            disabled={isLoading}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: "1rem" }}
          >
            {isLoading ? (
              <CircularProgress sx={{ color: "#fff" }} size={24} />
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </Button>

          <Box mt={2}>
            <Link href="#" onClick={toggleAuthMode} variant="body2">
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </Link>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Auth;
