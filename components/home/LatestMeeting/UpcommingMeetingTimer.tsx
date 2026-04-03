"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { Meeting } from "@/dto/Meeting";
import { useQueryClient } from "@tanstack/react-query";
import CountdownTimer, { CountdownRenderProps } from "@/hooks/useCountdown";


interface UpcommingMeetingProps {
  getCurrentTime: () => void;
  meeting: Meeting | null;
}

const UpcomingMeetingTimer = ({ getCurrentTime, meeting }: UpcommingMeetingProps) => {
  const [upcommingText, setUpcommingText] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!meeting) {
      setUpcommingText("");
    }
  }, [meeting]);

  const handleTick = useCallback(
    ({ hours, minutes, seconds, isFinished }: CountdownRenderProps) => {
      if (!meeting || isFinished) return;
      getCurrentTime();
      const formatted = `${hours}h ${minutes}m ${seconds}s`;
      setUpcommingText(formatted);
    },
    [getCurrentTime, meeting],
  );

  const handleFinish = useCallback(() => {
    if (!meeting) return;
    setUpcommingText("");
    queryClient.setQueryData(
      ["live-meeting", user?.id],
      (oldData: Meeting[] | null | undefined) => {
        if (!oldData) return [meeting];
        const exists = oldData.some((m) => m.id === meeting.id);
        if (exists) return oldData;
        return [meeting, ...oldData];
      },
    );
    queryClient.invalidateQueries({ queryKey: ["latest-meeting", user?.id] });
  }, [meeting, queryClient, user?.id]);

  return (
    <CountdownTimer
      targetTime={meeting?.starttime}
      onTick={handleTick}
      onFinish={handleFinish}
    >
      {() => (
        <h1 className="glassmorphhism  max-w:-[270px] text-center text-lg font-normal  md:text-3xl ">
          {upcommingText
            ? `"${meeting?.meetingtitle}" meeting in  ${upcommingText}`
            : "No Upcomming Meeting"}
        </h1>
      )}
    </CountdownTimer>
  );
};

export default UpcomingMeetingTimer;
