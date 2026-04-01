"use client";
import React, { Suspense } from "react";

import { Meeting } from "@/dto/Meetingtype";
import LatestMeeting from "./LatestMeeting/Latest-meeting";
import MeetingList from "./Meeting-list";
import { useQuery } from "@tanstack/react-query";
import { MeetingService } from "@/services/MeetingService";
import { useAuth } from "@/contexts/AuthContext";

import Link from "next/link";
import LiveMeeting from "./LiveMeeting/Live-meeting";

interface HomePageProps {
  latestmeeting: Meeting | null;
  livemeeting: Meeting[] | null;
}
const HomePage = ({ latestmeeting, livemeeting }: HomePageProps) => {
  const { user } = useAuth();
  if (!user)
    return (
      <h1>
        <Link href={"/"}>refresh</Link>{" "}
      </h1>
    );
  const supabase = MeetingService.Client();

  const { data: latestMeet } = useQuery({
    queryKey: ["latest-meeting", user.id],
    queryFn: async () => {
      const res = await supabase.getLatestMeeting();

      return res.success ? res.data : null;
    },
    initialDataUpdatedAt: latestmeeting ? Date.now() : undefined,
    initialData: latestmeeting,
    refetchOnWindowFocus: false,
  });

  const { data: liveMeetings } = useQuery({
    queryKey: ["live-meeting", user.id],
    queryFn: async () => {
      const res = await supabase.getLiveMeeting();
      return res.success ? res.data : null;
    },
    initialDataUpdatedAt: livemeeting ? Date.now() : undefined,

    initialData: livemeeting,
    refetchOnWindowFocus: false,
  });

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <LatestMeeting meeting={latestMeet} />
      </div>
      <MeetingList />
      <Suspense fallback={<h1>live meetings loading...</h1>}>
        <LiveMeeting meeting={liveMeetings} />
      </Suspense>
    </section>
  );
};

export default HomePage;
