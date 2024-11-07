import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import NotFound from "./NotFound";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import Home from "./Home";
import Books from "./Books";

export default function Root() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index path="home" element={<Home />} />
        <Route index path="books" element={<Books />} />
      </Route>
      <Route path="auth" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
