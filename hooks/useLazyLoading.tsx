import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";

interface LazyLoadingProps<T> {
  queryKey: readonly unknown[];
  fetchFn: (pageParam: number) => Promise<T>;
  enabled?: boolean;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  initialPageParam?: number;
  initialData?: InfiniteData<T>;
  initialDataUpdatedAt?: number;

  getNextPageParam?: (lastPage: T) => number | undefined;
  getPreviousPageParam?: (firstPage: T) => number | undefined;
}

export default function useLazyLoading<T>({
  queryKey,
  fetchFn,
  enabled = true,
  refetchOnWindowFocus = false,
  refetchOnMount = false,
  initialPageParam = 1,
  initialData,
  initialDataUpdatedAt,
  getNextPageParam,
  getPreviousPageParam,
}: LazyLoadingProps<T>): UseInfiniteQueryResult<InfiniteData<T>, Error> {
  return useInfiniteQuery({
    queryKey,
    initialPageParam,
    queryFn: ({ pageParam = initialPageParam }) => fetchFn(pageParam as number),
    initialData,
    initialDataUpdatedAt,

    
    getNextPageParam: getNextPageParam ?? ((lastPage: any) => {
      if (lastPage?.has_next) return lastPage.next_page;
      if (lastPage?.success && lastPage?.data?.pagination?.hasNextPage) {
        return lastPage.data.pagination.currentPage + 1;
      }
      return undefined;
    }),

    getPreviousPageParam: getPreviousPageParam ?? ((firstPage: any) => {
      if (firstPage?.has_previous) return firstPage.previous_page;
      return undefined;
    }),

    enabled,
    refetchOnWindowFocus,
    refetchOnMount,
  });
}
