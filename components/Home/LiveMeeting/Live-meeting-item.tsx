"use client";

import React, { memo } from "react";
import { Meeting } from "@/dto/Meetingtype";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatTime } from "@/lib/utils";

const LiveMeetingItem = memo(function LiveMeetingItem({
  meet,
  meetingService,
  router,
}: {
  meet: Meeting;
  meetingService: any;
  router: any;
}) {
  const joinCreatedMeeting = useMutation({
    mutationFn: async () => {
      const res = await meetingService.joinYourCreatedMeeting({
        meetingid: meet.id,
      });
      if (!res.success) throw new Error(res.error?.message);
      return res.data;
    },

    onSuccess: (data) => {
      toast.success("Joining meeting…");
      router.replace(
        `meeting/${encodeURIComponent(data.meetings.meetinglink)}`,
      );
    },

    onError: () => {
      toast.error("Error joining meeting");
    },
  });

  return (
    <div className="border p-4 rounded-md mb-4">
      <h2 className="text-lg font-semibold mb-2">{meet.meetingtitle}</h2>

      <p className="text-sm text-gray-600">
        Start Time: {formatTime(meet.starttime)}
      </p>
      <p className="text-sm text-gray-600">
        End Time: {formatTime(meet.endtime)}
      </p>

      <button
        className="bg-blue-500 mt-3 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        onClick={() => joinCreatedMeeting.mutate()}
        disabled={joinCreatedMeeting.isPending}
      >
        {joinCreatedMeeting.isPending ? "Joining…" : "Join Meeting"}
      </button>
    </div>
  );
});

export default LiveMeetingItem;
