import { Suspense } from "react";
import { InfiniteData } from "@tanstack/react-query";
import PreviousMeeting from "@/components/home/PreviousMeeting";
import LoadingPrevious from "./loading";
import { MeetingService } from "@/services/MeetingService";
import { Meeting, MeetingPagination } from "@/dto/Meeting";

const Previous = async () => {
  const meetingService = await MeetingService.Server();
  const res = await meetingService.getAllCreatedMeeting({
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
    <section className="flex size-full flex-col gap-10 text-white no-scrollbar overflow-y-auto">
      <h1 className="text-extrobold text-3xl">Previous Meeting</h1>
      <Suspense fallback={<LoadingPrevious />}>
        <PreviousMeeting
          initialData={initialData}
          initialDataUpdatedAt={initialData ? Date.now() : undefined}
        />
      </Suspense>
    </section>
  );
};

export default Previous;
