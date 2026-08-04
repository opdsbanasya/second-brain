import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "@/store/hooks";

export function RequireAuth({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated, sessionChecked } = useAppSelector(
    (state) => state.auth,
  );
  const location = useLocation();
  if (!sessionChecked)
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Checking your session...
      </div>
    );
  return isAuthenticated ? (
    (children ?? <Outlet />)
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
}
