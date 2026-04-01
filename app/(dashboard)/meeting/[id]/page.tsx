
import { Suspense } from "react";
import MeetingLoading from "../loading";
import { MeetingService } from "@/services/MeetingService";
import { QueryClient } from "@tanstack/react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import MeetingPage from "@/components/meetingpage/Meeting-page";
import { redirect } from "next/navigation";


type PageParams = {
  params: Promise<{ id: string }>;
};
const Meeting = async ({ params }: PageParams) => {
  const id = await params;
  const meetingLink = decodeURIComponent(id.id);
  const meetingService = await MeetingService.Server();
 
 
  const joinMeeting=await meetingService.joinMeeting({meetingurl:meetingLink});
  console.log(joinMeeting)
  if(!joinMeeting.success){
    
    return notFound();
  }
   const meetingData = await meetingService.getMeeting({ meeting_url: meetingLink });
  
  const data = meetingData.success ? meetingData.data.meeting : null;
  if (!data) return notFound(); 

  const meetingId = data.id;
  const queryClient = new QueryClient();

  const users=await meetingService.isUserInMeeting({ meetingId: meetingId });

  if (!users.success) {
    return redirect("/"); 
  }

  if(!users.data){
    return notFound();
  }

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["meeting-users", meetingId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await meetingService.getUsers({
        limit: 1,
        meetingid: meetingId,
        page: pageParam as number,
      });
      if (!res.success) throw new Error("Failed to fetch users");
      return res.data;
    },
    initialPageParam: 1,
  });


  await queryClient.prefetchInfiniteQuery({
    queryKey: ["meeting-chats", meetingId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await meetingService.getChats({
        limit: 6,
        meetingid: meetingId,
        page: pageParam as number,
      });
      if (!res.success) throw new Error("Failed to fetch chats");
      return res.data;
    },
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      
        <div className="max-w-full max-h-screen mx-auto p-6 space-y-6">
          <div className="flex justify-between">
            <h1>Meeting Link: {meetingLink}</h1>
          </div>
        <Suspense fallback={<MeetingLoading />}>
          <MeetingPage meeting={data} />
          </Suspense>
        </div>
      
    </HydrationBoundary>
  );
};

export default Meeting;




