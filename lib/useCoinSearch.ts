// Client Component directive for Next.js hooks execution
"use client";

// Import router navigation hooks from Next.js App Router
import { useSearchParams, useRouter, usePathname } from "next/navigation";
// Import useQuery hook from TanStack React Query for data fetching, caching, and state management
import { useQuery } from "@tanstack/react-query";
// Import React optimization hooks (useCallback, useMemo)
import { useCallback, useMemo } from "react";
// Import TypeScript interfaces and type definitions for watchlist and filtering
import {
  CategoryFilter,
  ChangeQuickFilter,
  CoinFilterState,
  MarketCapTier,
  SortDirection,
  SortOption,
  WatchlistResponseDTO,
} from "@/types/watchlist";

// Export custom React hook managing search query, filters, sorting, pagination, and TanStack Query state
export function useCoinSearch(options?: {
  watchlistId?: string;
  tab?: string;
  initialData?: WatchlistResponseDTO;
}) {
  // Read current URL search parameters
  const searchParams = useSearchParams();
  // Get Next.js router instance for updating URL query params
  const router = useRouter();
  // Get current path string
  const pathname = usePathname();

  // Extract optional watchlist ID option
  const watchlistId = options?.watchlistId;
  // Determine active tab ('all', 'watchlist', 'gainers', 'losers')
  const tab = options?.tab || searchParams.get("tab") || "all";

  // Parse active filter values from URL searchParams using useMemo
  const filters: CoinFilterState = useMemo(() => {
    // Parse search text query ('q')
    const q = (searchParams.get("q") || "").trim();
    // Parse category filters array
    const categoryRaw = searchParams.get("category") || "";
    const categories = categoryRaw
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter((c): c is CategoryFilter =>
        [
          "LAYER_1",
          "DEFI",
          "STABLECOIN",
          "EXCHANGE_TOKEN",
          "MEME",
          "SMART_CONTRACT",
        ].includes(c)
      );

    // Parse price range numeric filters
    const priceMinStr = searchParams.get("priceMin");
    const priceMaxStr = searchParams.get("priceMax");
    const priceMin = priceMinStr ? parseFloat(priceMinStr) : null;
    const priceMax = priceMaxStr ? parseFloat(priceMaxStr) : null;

    // Parse 24-hour quick change filter
    const changeRaw = (searchParams.get("change") || "any").toLowerCase();
    const change: ChangeQuickFilter =
      changeRaw === "gainers" || changeRaw === "losers" ? changeRaw : "any";

    // Parse 24-hour change percentage range filters
    const changeMinStr = searchParams.get("changeMin");
    const changeMaxStr = searchParams.get("changeMax");
    const changeMin = changeMinStr ? parseFloat(changeMinStr) : null;
    const changeMax = changeMaxStr ? parseFloat(changeMaxStr) : null;

    // Parse Market Cap tier filter
    const capRaw = (searchParams.get("cap") || "all").toLowerCase();
    const cap: MarketCapTier =
      capRaw === "large" || capRaw === "mid" || capRaw === "small"
        ? capRaw
        : "all";

    // Parse active sorting column
    const sortRaw = (searchParams.get("sort") || "rank").toLowerCase();
    const sort: SortOption = [
      "rank",
      "price",
      "change",
      "marketCap",
      "volume",
      "name",
    ].includes(sortRaw)
      ? (sortRaw as SortOption)
      : "rank";

    // Parse active sorting direction ('asc' or 'desc')
    const dirRaw = (searchParams.get("dir") || "asc").toLowerCase();
    const dir: SortDirection = dirRaw === "desc" ? "desc" : "asc";

    // Parse pagination page index
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

    // Return constructed filter state object
    return {
      q,
      categories,
      priceMin,
      priceMax,
      change,
      changeMin,
      changeMax,
      cap,
      sort,
      dir,
      page,
    };
  }, [searchParams]);

  // Construct URL query string from filter state mutations
  const buildQueryString = useCallback(
    (newFilters: Partial<CoinFilterState> & { tab?: string; page?: number }) => {
      const params = new URLSearchParams(searchParams.toString());

      // Serialize active tab param
      const currentTab = newFilters.tab !== undefined ? newFilters.tab : tab;
      if (currentTab && currentTab !== "all") {
        params.set("tab", currentTab);
      } else {
        params.delete("tab");
      }

      // Serialize search query string
      const newQ = newFilters.q !== undefined ? newFilters.q : filters.q;
      if (newQ) {
        params.set("q", newQ);
      } else {
        params.delete("q");
      }

      // Serialize comma-separated category string
      const newCategories =
        newFilters.categories !== undefined
          ? newFilters.categories
          : filters.categories;
      if (newCategories.length > 0) {
        params.set("category", newCategories.join(","));
      } else {
        params.delete("category");
      }

      // Serialize minimum and maximum price params
      const newPriceMin =
        newFilters.priceMin !== undefined
          ? newFilters.priceMin
          : filters.priceMin;
      const newPriceMax =
        newFilters.priceMax !== undefined
          ? newFilters.priceMax
          : filters.priceMax;
      if (newPriceMin !== null && newPriceMin !== undefined) {
        params.set("priceMin", newPriceMin.toString());
      } else {
        params.delete("priceMin");
      }
      if (newPriceMax !== null && newPriceMax !== undefined) {
        params.set("priceMax", newPriceMax.toString());
      } else {
        params.delete("priceMax");
      }

      // Serialize 24h change params
      const newChange =
        newFilters.change !== undefined ? newFilters.change : filters.change;
      if (newChange && newChange !== "any") {
        params.set("change", newChange);
      } else {
        params.delete("change");
      }

      const newChangeMin =
        newFilters.changeMin !== undefined
          ? newFilters.changeMin
          : filters.changeMin;
      const newChangeMax =
        newFilters.changeMax !== undefined
          ? newFilters.changeMax
          : filters.changeMax;
      if (newChangeMin !== null && newChangeMin !== undefined) {
        params.set("changeMin", newChangeMin.toString());
      } else {
        params.delete("changeMin");
      }
      if (newChangeMax !== null && newChangeMax !== undefined) {
        params.set("changeMax", newChangeMax.toString());
      } else {
        params.delete("changeMax");
      }

      // Serialize market cap tier
      const newCap =
        newFilters.cap !== undefined ? newFilters.cap : filters.cap;
      if (newCap && newCap !== "all") {
        params.set("cap", newCap);
      } else {
        params.delete("cap");
      }

      // Serialize sort column and direction
      const newSort =
        newFilters.sort !== undefined ? newFilters.sort : filters.sort;
      const newDir =
        newFilters.dir !== undefined ? newFilters.dir : filters.dir;
      if (newSort && newSort !== "rank") {
        params.set("sort", newSort);
      } else {
        params.delete("sort");
      }
      if (newDir && newDir !== "asc") {
        params.set("dir", newDir);
      } else {
        params.delete("dir");
      }

      // Serialize current page index (resets to page 1 on filter modifications unless explicitly passed)
      const newPage =
        newFilters.page !== undefined ? newFilters.page : 1;
      if (newPage > 1) {
        params.set("page", newPage.toString());
      } else {
        params.delete("page");
      }

      return params.toString();
    },
    [searchParams, tab, filters]
  );

  // Helper method updating URL parameters without full page reload
  const updateFilters = useCallback(
    (newFilters: Partial<CoinFilterState> & { tab?: string; page?: number }) => {
      const queryString = buildQueryString(newFilters);
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newUrl, { scroll: false });
    },
    [buildQueryString, pathname, router]
  );

  // Helper method resetting all active filter query parameters
  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (tab && tab !== "all") {
      params.set("tab", tab);
    }
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newUrl, { scroll: false });
  }, [tab, pathname, router]);

  // Construct React Query cache key array dependent on current filters
  const queryKey = useMemo(
    () => ["coins", filters, watchlistId, tab],
    [filters, watchlistId, tab]
  );

  // Execute TanStack Query fetch call against /api/coins route
  const queryResult = useQuery<
    WatchlistResponseDTO & {
      page?: number;
      totalPages?: number;
      totalCount?: number;
      allMarketsCount?: number;
      minPrice?: number;
      maxPrice?: number;
    }
  >({
    queryKey,
    queryFn: async () => {
      const apiParams = new URLSearchParams();

      if (filters.q) apiParams.set("q", filters.q);
      if (filters.categories.length > 0)
        apiParams.set("category", filters.categories.join(","));
      if (filters.priceMin !== null)
        apiParams.set("priceMin", filters.priceMin.toString());
      if (filters.priceMax !== null)
        apiParams.set("priceMax", filters.priceMax.toString());
      if (filters.change !== "any") apiParams.set("change", filters.change);
      if (filters.changeMin !== null)
        apiParams.set("changeMin", filters.changeMin.toString());
      if (filters.changeMax !== null)
        apiParams.set("changeMax", filters.changeMax.toString());
      if (filters.cap !== "all") apiParams.set("cap", filters.cap);
      if (filters.sort !== "rank") apiParams.set("sort", filters.sort);
      if (filters.dir !== "asc") apiParams.set("dir", filters.dir);
      if (filters.page > 1) apiParams.set("page", filters.page.toString());
      if (tab) apiParams.set("tab", tab);
      if (watchlistId) apiParams.set("watchlistId", watchlistId);

      const res = await fetch(`/api/coins?${apiParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch coins data");
      return res.json();
    },
    initialData:
      !filters.q &&
      filters.categories.length === 0 &&
      filters.priceMin === null &&
      filters.priceMax === null &&
      filters.change === "any" &&
      filters.cap === "all" &&
      filters.sort === "rank" &&
      filters.page === 1
        ? options?.initialData
        : undefined,
    staleTime: 1000 * 4,
    refetchOnWindowFocus: true,
  });

  // Calculate count of active non-default filters for displaying badge count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.q) count++;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.priceMin !== null || filters.priceMax !== null) count++;
    if (
      filters.change !== "any" ||
      filters.changeMin !== null ||
      filters.changeMax !== null
    )
      count++;
    if (filters.cap !== "all") count++;
    return count;
  }, [filters]);

  // Return hook utilities and query response data
  return {
    filters,
    activeFiltersCount,
    updateFilters,
    clearAllFilters,
    ...queryResult,
  };
}

