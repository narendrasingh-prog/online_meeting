"use client";

import { MeetingService } from "@/services/MeetingService";
import MeetingCard from "../Meeting-card";
import { useInView } from "react-intersection-observer";
import React, { Suspense } from "react";
import useLazyLoading from "@/hooks/useLazyLoading";
import { InfiniteData } from "@tanstack/react-query";
import { Meeting, MeetingPagination } from "@/dto/Meetingtype";
import LoadingPrevious from "@/app/(dashboard)/(home)/previous/loading";

interface PreviousMeetingProps {
  initialData?: InfiniteData<MeetingPagination<Meeting>>;
  initialDataUpdatedAt?: number;
}

const PreviousMeeting = ({
  initialData,
  initialDataUpdatedAt,
}: PreviousMeetingProps) => {
  const meetingService = MeetingService.Client();
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const { ref: bottomRef, inView } = useInView({ threshold: 0 });
  const hasFetchedRef = React.useRef(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    error,
  } = useLazyLoading<MeetingPagination<Meeting>>({
    queryKey: ["previousmeetings"],
    initialPageParam: 1,
    initialData,
    initialDataUpdatedAt,

    fetchFn: async (pageParam) => {
      const res = await meetingService.getAllCreatedMeeting({
        p_limit: 8,
        p_page: pageParam,
      });
      if (!res.success) throw new Error("Cannot fetch meetings");
      return res.data;
    },

    getNextPageParam: (lastPage) => {
      if (!lastPage.has_next) return undefined;
      return lastPage.next_page ?? undefined;
    },
    getPreviousPageParam: (lastPage) => {
      if (!lastPage.has_previous) return undefined;
      return lastPage.previous_page ?? undefined;
    },
    refetchOnWindowFocus: false,

    refetchOnMount: false,
  });

  React.useEffect(() => {
    if (!inView) {
      hasFetchedRef.current = false;
      return;
    }

    if (hasFetchedRef.current || !hasNextPage || isFetchingNextPage) return;

    hasFetchedRef.current = true;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  // if (isLoading) return <div>Loading meetings...</div>;
  if (error)
    return (
      <div className="flex flex-col justify-center ">
        <button
          className="bg-blue-600 rounded-md px-6 py-3 text-center mx-auto my-8"
          onClick={() => refetch()}
        >
          refresh{" "}
        </button>
        <div className="text-center">
          something went wrong while fetching previous meeting.
        </div>
      </div>
    );

  const meetings = data?.pages.flatMap((page) => page.meetings) ?? [];

  return (
    <div ref={scrollRef} className="overflow-y-auto no-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Suspense fallback={<LoadingPrevious />}>
          <MeetingCard meetings={meetings} />
        </Suspense>
      </div>

      <div ref={bottomRef} className="py-2">
        {isFetchingNextPage && (
          <p className="text-center text-sm text-gray-500">Loading more...</p>
        )}
        {!hasNextPage && meetings.length > 0 && (
          <p className="text-center text-sm text-gray-500">No more meetings</p>
        )}
        {!isLoading && meetings.length === 0 && (
          <p className="text-center text-sm text-gray-500">
            No previous meetings
          </p>
        )}
      </div>
    </div>
  );
};

export default PreviousMeeting;
