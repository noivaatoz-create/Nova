import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const { data, isLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/session"],
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!isLoading && !data?.isAdmin) {
      setLocation("/admin/login");
    }
  }, [data, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(220,18%,11%)]">
        <div className="h-8 w-8 border-2 border-[hsl(38,92%,50%)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data?.isAdmin) {
    return null;
  }

  return <>{children}</>;
}
