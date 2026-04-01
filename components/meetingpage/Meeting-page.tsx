"use client";

import React, { Fragment, Suspense, useEffect, useRef, useState } from "react";
import Participants from "./Participants";
import MeetingDetails from "./Meeting-details";
import { Meeting } from "@/dto/Meetingtype";
import { MeetingService } from "@/services/MeetingService";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LeaveMeeting from "./Leave-meeting";
import ChatWrapper from "./Chats/Chat-wrapper";
import { SupabaseService } from "@/lib/supabase/SupabaseService";
import { useAuth } from "@/contexts/AuthContext";
import { usePresence } from "@/hooks/usePresence";

const MeetingPage = ({ meeting }: { meeting: Meeting }) => {
  const meetingService = MeetingService.Client();
  const { user } = useAuth();
  const router = useRouter();

  const channelRef = useRef<any>(null);
  const hasLeftRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  const [leaveMeeting, setLeaveMeeting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      userIdRef.current = String(user.id);
    }
  }, [user?.id]);

  if (!user) return <h1>Loading...</h1>;

  // 1) CREATE CHANNEL ONLY ONCE
  useEffect(() => {
    const supabase = SupabaseService.browser();

    const channel = supabase.channel(`meeting-${meeting.id}`, {
      config: {
        presence: { key: String(user.id) }
      }
    });

    channelRef.current = channel;

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.track({
          user_id: String(user.id),
          joined_at: new Date().toISOString()
        });
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); 

  // 2) PRESENCE LEAVE HANDLER
  usePresence(channelRef, String(user.id), async (leftUserId) => {
    const current = userIdRef.current;

    if (!current || leftUserId !== current) return;
    if (hasLeftRef.current) return;

    hasLeftRef.current = true;

    await meetingService.leaveMeeting({
      meetingid: meeting.id,
      userid: current
    });

    router.push("/");
  });

  // 3) TAB CLOSE / PAGE CLOSE
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!hasLeftRef.current && userIdRef.current) {
        hasLeftRef.current = true;
        meetingService.leaveMeeting({
          meetingid: meeting.id,
          userid: userIdRef.current
        });
      }
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // 4) MANUAL LEAVE BUTTON
  const leaveMeetingMutation = useMutation({
    mutationFn: async ({ meetingId }: { meetingId: number }) => {
      const uid = userIdRef.current;
      if (!uid) throw new Error("User ID not available");

      return await meetingService.leaveMeeting({
        meetingid: meetingId,
        userid: uid
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Left meeting");
      } else {
        toast.error("Something went wrong");
      }
      router.push("/");
    },
    onError: (err) => {
      toast.error("Try again");
      router.push("/");
    }
  });

  useEffect(() => {
    if (!leaveMeeting || hasLeftRef.current) return;

    hasLeftRef.current = true;
    channelRef.current?.untrack();

    leaveMeetingMutation.mutate({ meetingId: meeting.id });
  }, [leaveMeeting]);

  return (
    <Fragment>
      <section className="flex flex-col lg:flex-row justify-center">
        <LeaveMeeting meetingId={meeting.id} />
        <Suspense fallback={<h1>Participants loading</h1>}>
          <Participants meeting={meeting} />
        </Suspense>

        <div className="flex flex-col flex-1">
          <MeetingDetails meeting={meeting} onleave={() => setLeaveMeeting(true)} />
          <ChatWrapper meeting={meeting} />
        </div>
      </section>
    </Fragment>
  );
};

export default MeetingPage;