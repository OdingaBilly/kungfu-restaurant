import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Loader2 } from "lucide-react";

const AdminGuard = ({ children }: { children: ReactNode }) => {
  const { isAdmin, loading, isAuthenticated } = useIsAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth?redirect=/admin" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-center px-6">
        <h1 className="font-display text-4xl text-primary">Restricted Zone</h1>
        <p className="text-foreground/60 max-w-md">
          You need admin or manager access to enter the kitchen control room.
        </p>
        <a href="/" className="text-primary underline">Back to safety</a>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
