import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 0, // Always fresh
    gcTime: 0, // Don't cache (updated from cacheTime in v5)
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}