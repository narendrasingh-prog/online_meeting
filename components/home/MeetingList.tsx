"use client";

import { useState, useCallback, memo, Fragment } from "react";
import HomeCard from "../Home-card";
import MeetingModel from "../Meeting-model";
import { MeetingService } from "@/services/MeetingService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addHours } from "date-fns";
import { MeetingType } from "../Meeting-model";
import { useAuth } from "@/contexts/AuthContext";

const MeetingList = () => {
  const [meetingType, setMeetingType] = useState<MeetingType["type"]>("Idle");
  const { user } = useAuth();
  const typeofmeeting: { readonly type: MeetingType["type"] } = {
    type: meetingType,
  };

  const supabase = MeetingService.Client();
  const queryClient = useQueryClient();
  const router = useRouter();

  const resetState = useCallback(() => setMeetingType("Idle"), []);

  const joinMeetingMutation = useMutation({
    mutationFn: async ({ meetingLink }: { meetingLink: string }) => {
      const res = await supabase.joinMeeting({ meetingurl: meetingLink });
      if (!res.success)
        throw new Error(res.error?.message ?? "Failed to join meeting");
      return meetingLink;
    },
    onSuccess: (data) => {
      toast.success("Joining meeting...");
      router.replace(`meeting/${encodeURIComponent(data)}`);
      resetState();
    },
    onError: () => {
      toast.error("Error joining meeting");
    },
  });

  const CreateScheduledMeeting = useMutation({
    mutationFn: async ({
      title,
      starttime,
      endtime,
    }: {
      title: string;
      starttime: string;
      endtime: string;
    }) => {
      const res = await supabase.createMeeting({
        meetingtitle: title,
        starttime,
        endtime,
      });
      if (!res.success)
        throw new Error(res.error?.message ?? "Failed to schedule meeting");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Meeting scheduled successfully");
      queryClient.invalidateQueries({ queryKey: ["latest-meeting", user!.id] });
      resetState();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const InstantMeeting = useMutation({
    mutationFn: async ({
      title,
      starttime,
      endtime,
    }: {
      title: string;
      starttime: string;
      endtime: string;
    }) => {
      const res = await supabase.createMeeting({
        meetingtitle: title,
        starttime,
        endtime,
      });
      if (!res.success)
        throw new Error(res.error?.message ?? "Failed to create meeting");
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Joining instantly");
      router.push(`meeting/${encodeURIComponent(data.meeting.meetinglink)}`);
      resetState();
    },
    onError: () => {
      toast.error("Error creating meeting, please try again");
    },
  });

  const createMeeting = useCallback((data: MeetingType) => {
    const now = new Date();
    if (data.type === "InstantMeeting") {
      if (!data.title) return toast.error("Please enter the title");
      if (isNaN(data.hours)) return toast.error("Hours must be a number");
      InstantMeeting.mutate({
        title: data.title,
        starttime: now.toISOString(),
        endtime: addHours(now, data.hours).toISOString(),
      });
    }
    if (data.type === "JoinMeeting") {
      if (!data.link) return toast.error("Please enter a meeting link");
      joinMeetingMutation.mutate({ meetingLink: data.link });
    }
    if (data.type === "Scheduled") {
      if (!data.title) return toast.error("Please enter a title");
      if (!data.start) return toast.error("Please enter a start time");
      if (!data.end) return toast.error("Please enter an end time");
      const startMs = new Date(data.start).getTime();
      if (startMs <= Date.now()) return toast.error("Scheduled start must be in the future");
      CreateScheduledMeeting.mutate({
        title: data.title,
        starttime: data.start,
        endtime: data.end,
      });
    }
  }, []);

  const handleInstantMeeting = useCallback(
    () => setMeetingType("InstantMeeting"),
    [],
  );
  const handleScheduleMeeting = useCallback(
    () => setMeetingType("Scheduled"),
    [],
  );
  const handleJoinMeeting = useCallback(
    () => setMeetingType("JoinMeeting"),
    [],
  );
  const handleClose = useCallback(() => setMeetingType("Idle"), []);
  console.log("meeting list rerender")
  return (
    <Fragment>
      <section className="grid grid-cols-1 gap-1 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <HomeCard
          img="/icons/add-meeting.svg"
          alt="add meeting"
          title="Instant Meeting"
          description="Start an instant meeting"
          handleClick={handleInstantMeeting}
        />
        <HomeCard
          img="/icons/schedule.svg"
          alt="schedule"
          title="Schedule Meeting"
          description="Schedule a meeting"
          handleClick={handleScheduleMeeting}
        />
        <HomeCard
          img="/icons/join-meeting.svg"
          alt="join meeting"
          title="Join Meeting"
          description="Join a meeting"
          handleClick={handleJoinMeeting}
        />

      </section>
      <MeetingModel
        open={meetingType !== "Idle"}
        meetingType={typeofmeeting.type}
        loading={
          (meetingType === "JoinMeeting" && joinMeetingMutation.isPending) ||
          (meetingType === "Scheduled" && CreateScheduledMeeting.isPending) ||
          (meetingType === "InstantMeeting" && InstantMeeting.isPending)
        }
        close={handleClose}
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </Fragment>
  );
};

export default MeetingList;
