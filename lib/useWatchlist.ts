"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WatchlistResponseDTO } from "@/types/watchlist";

export function useWatchlist(watchlistId = "default-watchlist") {
  const queryClient = useQueryClient();

  // Query to fetch the base watchlist state
  const watchlistQuery = useQuery<WatchlistResponseDTO>({
    queryKey: ["watchlist", watchlistId],
    queryFn: async () => {
      const res = await fetch(`/api/watchlists/${watchlistId}?tab=watchlist`);
      if (!res.ok) throw new Error("Failed to fetch watchlist");
      return res.json();
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 4,
  });

  // Extract set of starred coin IDs for instant lookup
  const starredCoinIds = new Set(
    (watchlistQuery.data?.items || [])
      .filter((item) => item.isStarred)
      .map((item) => item.id)
  );

  // Star / Unstar Mutation with Optimistic Cache Updates
  const toggleStarMutation = useMutation({
    mutationFn: async ({
      coinId,
      isStarred,
    }: {
      coinId: string;
      isStarred: boolean;
    }) => {
      if (isStarred) {
        // DELETE item
        const res = await fetch(
          `/api/watchlists/${watchlistId}/items/${coinId}`,
          {
            method: "DELETE",
          }
        );
        if (!res.ok) throw new Error("Failed to remove coin from watchlist");
        return res.json();
      } else {
        // POST item
        const res = await fetch(`/api/watchlists/${watchlistId}/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coinId }),
        });
        if (!res.ok) throw new Error("Failed to add coin to watchlist");
        return res.json();
      }
    },
    onMutate: async ({ coinId, isStarred }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["watchlist"] });

      const previousQueries = queryClient.getQueriesData<WatchlistResponseDTO>({
        queryKey: ["watchlist"],
      });

      const nextStarred = !isStarred;
      const delta = nextStarred ? 1 : -1;

      // Optimistically update ALL watchlist query data caches in React Query
      queryClient.setQueriesData<WatchlistResponseDTO>(
        { queryKey: ["watchlist"] },
        (oldData) => {
          if (!oldData) return oldData;

          const updatedItems = oldData.items.map((coin) => {
            if (coin.id === coinId) {
              return { ...coin, isStarred: nextStarred };
            }
            return coin;
          });

          return {
            ...oldData,
            totalTracked: Math.max(0, (oldData.totalTracked || 0) + delta),
            items: updatedItems,
          };
        }
      );

      return { previousQueries };
    },
    onError: (_err, _variables, context) => {
      // Rollback to previous queries if error occurs
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Revalidate watchlist queries across pages
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  return {
    watchlistData: watchlistQuery.data,
    isLoading: watchlistQuery.isLoading,
    starredCoinIds,
    totalTracked: watchlistQuery.data?.totalTracked ?? 0,
    toggleStar: (coinId: string, currentStarred: boolean) =>
      toggleStarMutation.mutate({ coinId, isStarred: currentStarred }),
    isPending: toggleStarMutation.isPending,
  };
}
