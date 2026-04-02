"use client";

import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { Suspense, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import MeetingCard from "../MeetingCard";
import { Meeting, MeetingPagination } from "@/dto/Meeting";

interface InfiniteMeetingListProps {
  queryKey: readonly unknown[];
  fetchFn: (pageParam: number) => Promise<MeetingPagination<Meeting>>;
  initialData?: InfiniteData<MeetingPagination<Meeting>>;
  initialDataUpdatedAt?: number;
  enabled?: boolean;
  containerClassName?: string;
  gridClassName?: string;
  loadingFallback?: ReactNode;
  emptyMessage: string;
  errorMessage: string;
  noMoreMessage?: string;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  initialPageParam?: number;
  getNextPageParam?: (lastPage: MeetingPagination<Meeting>) => number | undefined;
  getPreviousPageParam?: (
    firstPage: MeetingPagination<Meeting>,
  ) => number | undefined;
}

const InfiniteMeetingList = ({
  queryKey,
  fetchFn,
  initialData,
  initialDataUpdatedAt,
  enabled = true,
  containerClassName = "overflow-y-auto no-scrollbar",
  gridClassName = "grid grid-cols-1 md:grid-cols-2 gap-4",
  loadingFallback = null,
  emptyMessage,
  errorMessage,
  noMoreMessage = "No more meetings",
  refetchOnWindowFocus = false,
  refetchOnMount = false,
  getNextPageParam,
  getPreviousPageParam,
  initialPageParam = 1,
}: InfiniteMeetingListProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { ref: bottomRef, inView } = useInView({ threshold: 0 });
  const hasFetchedRef = useRef(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    error,
  } = useInfiniteQuery<MeetingPagination<Meeting>, Error>({
    queryKey,
    initialPageParam,
    queryFn: ({ pageParam = initialPageParam }) =>
      fetchFn(pageParam as number),
    initialData,
    initialDataUpdatedAt,
    getNextPageParam:
      getNextPageParam ??
      ((lastPage: MeetingPagination<Meeting>) => {
        if (!lastPage.has_next) return undefined;
        return lastPage.next_page ?? undefined;
      }),
    getPreviousPageParam:
      getPreviousPageParam ??
      ((firstPage: MeetingPagination<Meeting>) => {
        if (!firstPage.has_previous) return undefined;
        return firstPage.previous_page ?? undefined;
      }),
    enabled,
    refetchOnWindowFocus,
    refetchOnMount,
  });

  useEffect(() => {
    if (!inView) {
      hasFetchedRef.current = false;
      return;
    }

    if (hasFetchedRef.current || !hasNextPage || isFetchingNextPage) return;

    hasFetchedRef.current = true;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  if (error)
    return (
      <div className="flex flex-col justify-center ">
        <button
          className="bg-blue-600 rounded-md px-6 py-3 text-center mx-auto my-8"
          onClick={() => refetch()}
        >
          refresh{" "}
        </button>
        <div className="text-center">{errorMessage}</div>
      </div>
    );

  const meetings = data?.pages.flatMap((page) => page.meetings) ?? [];

  return (
    <div ref={scrollRef} className={containerClassName}>
      <div className={gridClassName}>
        <Suspense fallback={loadingFallback}>
          <MeetingCard meetings={meetings} />
        </Suspense>
      </div>

      <div ref={bottomRef} className="py-2">
        {isFetchingNextPage && (
          <p className="text-center text-sm text-gray-500">Loading more...</p>
        )}
        {!hasNextPage && meetings.length > 0 && (
          <p className="text-center text-sm text-gray-500">{noMoreMessage}</p>
        )}
        {!isLoading && meetings.length === 0 && (
          <p className="text-center text-sm text-gray-500">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
};

export default InfiniteMeetingList;
