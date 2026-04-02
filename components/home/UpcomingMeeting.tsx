"use client";

import { MeetingService } from "@/services/MeetingService";
import InfiniteMeetingList from "./InfiniteMeetingList";
import { useAuth } from "@/contexts/AuthContext";
import { InfiniteData } from "@tanstack/react-query";
import { Meeting, MeetingPagination } from "@/dto/Meeting";
import LoadingUpcoming from "@/app/(dashboard)/(home)/upcoming/loading";

interface UpcomingMeetingProps {
  initialData?: InfiniteData<MeetingPagination<Meeting>>;
  initialDataUpdatedAt?: number;
}

const UpcomingMeeting = ({
  initialData,
  initialDataUpdatedAt,
}: UpcomingMeetingProps) => {
  const meetingService = MeetingService.Client();
  const { user } = useAuth();

  const fetchUpcomingMeetings = async (pageParam: number) => {
    const res = await meetingService.getAllUpcommingMeeting({
      p_limit: 4,
      p_page: pageParam,
    });
    if (!res.success) throw new Error("Cannot fetch meetings");
    return res.data;
  };

  if (!user) return <div>Loading user...</div>;

  return (
    <InfiniteMeetingList
      queryKey={["upcomingmeetings"]}
      fetchFn={fetchUpcomingMeetings}
      initialData={initialData}
      initialDataUpdatedAt={initialDataUpdatedAt}
      enabled={!!user}
      loadingFallback={<LoadingUpcoming />}
      emptyMessage="No upcoming meetings"
      errorMessage="something went wrong while fetching upcomming meeting."
      gridClassName="grid grid-cols-1 md:grid-cols-2  gap-4"
    />
  );
};

export default UpcomingMeeting;
