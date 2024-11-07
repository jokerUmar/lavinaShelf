import { useEffect } from "react";
import Header from "../components/Header";
import { Outlet, useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("home");
  }, []);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
