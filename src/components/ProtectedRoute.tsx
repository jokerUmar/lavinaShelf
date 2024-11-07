import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useZustandStore } from "../lib/store";

type ProtectedRouteProps = PropsWithChildren;

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useZustandStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === undefined) {
      navigate("/auth", { replace: true });
    }
  }, [navigate, user]);

  return user ? children : <></>;
}
