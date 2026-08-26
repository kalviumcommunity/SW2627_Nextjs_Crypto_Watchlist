"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import {
  CategoryFilter,
  ChangeQuickFilter,
  CoinFilterState,
  MarketCapTier,
  SortDirection,
  SortOption,
  WatchlistResponseDTO,
} from "@/types/watchlist";

export function useCoinSearch(options?: {
  watchlistId?: string;
  tab?: string;
  initialData?: WatchlistResponseDTO;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const watchlistId = options?.watchlistId;
  const tab = options?.tab || searchParams.get("tab") || "all";

  // Parse filters from searchParams
  const filters: CoinFilterState = useMemo(() => {
    const q = (searchParams.get("q") || "").trim();
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

    const priceMinStr = searchParams.get("priceMin");
    const priceMaxStr = searchParams.get("priceMax");
    const priceMin = priceMinStr ? parseFloat(priceMinStr) : null;
    const priceMax = priceMaxStr ? parseFloat(priceMaxStr) : null;

    const changeRaw = (searchParams.get("change") || "any").toLowerCase();
    const change: ChangeQuickFilter =
      changeRaw === "gainers" || changeRaw === "losers" ? changeRaw : "any";

    const changeMinStr = searchParams.get("changeMin");
    const changeMaxStr = searchParams.get("changeMax");
    const changeMin = changeMinStr ? parseFloat(changeMinStr) : null;
    const changeMax = changeMaxStr ? parseFloat(changeMaxStr) : null;

    const capRaw = (searchParams.get("cap") || "all").toLowerCase();
    const cap: MarketCapTier =
      capRaw === "large" || capRaw === "mid" || capRaw === "small"
        ? capRaw
        : "all";

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

    const dirRaw = (searchParams.get("dir") || "asc").toLowerCase();
    const dir: SortDirection = dirRaw === "desc" ? "desc" : "asc";

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

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

  // Construct URL query string from state
  const buildQueryString = useCallback(
    (newFilters: Partial<CoinFilterState> & { tab?: string; page?: number }) => {
      const params = new URLSearchParams(searchParams.toString());

      // Handle tab
      const currentTab = newFilters.tab !== undefined ? newFilters.tab : tab;
      if (currentTab && currentTab !== "all") {
        params.set("tab", currentTab);
      } else {
        params.delete("tab");
      }

      // Handle search query
      const newQ = newFilters.q !== undefined ? newFilters.q : filters.q;
      if (newQ) {
        params.set("q", newQ);
      } else {
        params.delete("q");
      }

      // Handle categories
      const newCategories =
        newFilters.categories !== undefined
          ? newFilters.categories
          : filters.categories;
      if (newCategories.length > 0) {
        params.set("category", newCategories.join(","));
      } else {
        params.delete("category");
      }

      // Handle price range
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

      // Handle 24h change
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

      // Handle Market Cap Tier
      const newCap =
        newFilters.cap !== undefined ? newFilters.cap : filters.cap;
      if (newCap && newCap !== "all") {
        params.set("cap", newCap);
      } else {
        params.delete("cap");
      }

      // Handle Sort
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

      // Handle Page (Reset to 1 unless specified)
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

  // Update URL state helper
  const updateFilters = useCallback(
    (newFilters: Partial<CoinFilterState> & { tab?: string; page?: number }) => {
      const queryString = buildQueryString(newFilters);
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newUrl, { scroll: false });
    },
    [buildQueryString, pathname, router]
  );

  // Clear all active filters
  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (tab && tab !== "all") {
      params.set("tab", tab);
    }
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newUrl, { scroll: false });
  }, [tab, pathname, router]);

  // Query Key for React Query caching
  const queryKey = useMemo(
    () => ["coins", filters, watchlistId, tab],
    [filters, watchlistId, tab]
  );

  // Fetch API call
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

  return {
    filters,
    activeFiltersCount,
    updateFilters,
    clearAllFilters,
    ...queryResult,
  };
}
