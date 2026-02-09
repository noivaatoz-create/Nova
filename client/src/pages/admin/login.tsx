import { useState } from "react";
import { useLocation } from "wouter";
import { Droplets, Lock, User, LogIn } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/admin/login", { username, password });
      const data = await res.json();
      if (data.success) {
        setLocation("/admin");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(220,50%,4%)] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Droplets className="h-8 w-8 text-[hsl(220,91%,55%)]" />
            <span className="text-2xl font-bold tracking-tight text-white">NOVAATOZ</span>
          </div>
          <p className="text-[hsl(215,30%,65%)] text-sm">Admin Panel Login</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[hsl(220,38%,10%)] border border-[hsl(218,35%,17%)] rounded-md p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[hsl(215,30%,65%)] mb-1.5">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(215,30%,65%)]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,40%,7%)] pl-10 pr-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(220,91%,55%)] placeholder-[hsl(215,30%,65%)]"
                placeholder="Enter username"
                data-testid="input-admin-username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[hsl(215,30%,65%)] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(215,30%,65%)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-[hsl(218,35%,17%)] bg-[hsl(220,40%,7%)] pl-10 pr-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(220,91%,55%)] placeholder-[hsl(215,30%,65%)]"
                placeholder="Enter password"
                data-testid="input-admin-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-[hsl(220,91%,55%)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[hsl(220,91%,45%)] transition-colors disabled:opacity-50"
            data-testid="button-admin-login"
          >
            <LogIn className="h-4 w-4" />
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
