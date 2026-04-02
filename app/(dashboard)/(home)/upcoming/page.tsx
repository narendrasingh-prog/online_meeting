import { Suspense } from "react";
import { InfiniteData } from "@tanstack/react-query";
import UpcomingMeeting from "@/components/home/UpcomingMeeting";
import LoadingUpcoming from "./loading";
import { MeetingService } from "@/services/MeetingService";
import { Meeting, MeetingPagination } from "@/dto/Meeting";

const Upcomming = async () => {
  const meetingService = await MeetingService.Server();
  const res = await meetingService.getAllUpcommingMeeting({
    p_limit: 8,
    p_page: 1,
  });

  const initialData: InfiniteData<MeetingPagination<Meeting>> | undefined =
    res.success
      ? {
          pages: [res.data],
          pageParams: [1],
        }
      : undefined;

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl fold-bold">Upcoming</h1>
      <div className="no-scrollbar overflow-y-auto">
        <Suspense fallback={<LoadingUpcoming />}>
          <UpcomingMeeting
            initialData={initialData}
            initialDataUpdatedAt={initialData ? Date.now() : undefined}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default Upcomming;
