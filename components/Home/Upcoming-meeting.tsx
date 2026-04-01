"use client";

import React, { Suspense } from "react";
import { MeetingService } from "@/services/MeetingService";
import MeetingCard from "../Meeting-card";
import { useAuth } from "@/contexts/AuthContext";
import { useInView } from "react-intersection-observer";
import useLazyLoading from "@/hooks/useLazyLoading";
import { Meeting, MeetingPagination } from "@/dto/Meetingtype"; 
import LoadingUpcoming from "@/app/(dashboard)/(home)/upcoming/loading";

const UpcomingMeeting = () => {
  const meetingService = MeetingService.Client();
  const { user } = useAuth();

  const { ref: bottomRef, inView } = useInView({ threshold: 0 });
  const scrollRef = React.useRef<HTMLDivElement | null>(null);


  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useLazyLoading<MeetingPagination<Meeting>>({
    queryKey: ["upcomingmeetings", user?.id],
    initialPageParam: 1,
    enabled: !!user,

    fetchFn: async (pageParam) => {
      const res = await meetingService.getAllUpcommingMeeting
        ({ 
          p_limit: 4,
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
  });

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!user) return <div>Loading user...</div>;
  // if (isLoading) return <div>Loading meetings...</div>;
  if (error) return <div>Error loading meetings</div>;

  const meetings = data?.pages.flatMap((page) => page.meetings) ?? [];

  return (
    <div ref={scrollRef} className="overflow-y-auto no-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Suspense fallback={<LoadingUpcoming/>}>
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
          <p className="text-center text-sm text-gray-500">No upcoming meetings</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingMeeting;