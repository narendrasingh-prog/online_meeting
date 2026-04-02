"use client";

import { MeetingService } from "@/services/MeetingService";
import InfiniteMeetingList from "./InfiniteMeetingList";
import { InfiniteData } from "@tanstack/react-query";
import { Meeting, MeetingPagination } from "@/dto/Meeting";
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

  const fetchPreviousMeetings = async (pageParam: number) => {
    const res = await meetingService.getAllCreatedMeeting({
      p_limit: 8,
      p_page: pageParam,
    });
    if (!res.success) throw new Error("Cannot fetch meetings");
    return res.data;
  };

  return (
    <InfiniteMeetingList
      queryKey={["previousmeetings"]}
      fetchFn={fetchPreviousMeetings}
      initialData={initialData}
      initialDataUpdatedAt={initialDataUpdatedAt}
      loadingFallback={<LoadingPrevious />}
      emptyMessage="No previous meetings"
      errorMessage="something went wrong while fetching previous meeting."
    />
  );
};

export default PreviousMeeting;
