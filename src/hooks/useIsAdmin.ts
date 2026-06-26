import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "admin" | "manager" | "staff";

export function useRoles() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-roles", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<AppRole[]> => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id);
      if (error) throw error;
      return (data ?? []).map((r) => r.role as AppRole);
    },
  });
}

export function useIsAdmin() {
  const { user, loading } = useAuth();
  const { data: roles, isLoading } = useRoles();
  const isAdmin = !!roles?.some((r) => r === "admin" || r === "manager");
  const isSuperAdmin = !!roles?.includes("admin");
  return {
    isAdmin,
    isSuperAdmin,
    roles: roles ?? [],
    loading: loading || (!!user && isLoading),
    isAuthenticated: !!user,
  };
}
