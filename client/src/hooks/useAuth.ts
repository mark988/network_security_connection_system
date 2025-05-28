import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 0, // Always refetch to check auth status
  });

  const logout = async () => {
    try {
      // Call both logout endpoints to ensure complete logout
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Also call the original Replit logout endpoint
      await fetch('/api/logout', {
        method: 'GET',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all queries and force navigation to home
      queryClient.clear();
      // Use replace to prevent back button issues
      window.location.replace('/');
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
