import React, { useEffect, useState } from 'react'

import { useAuth } from '@/contexts/AuthContext';
import { Meeting } from '@/dto/Meetingtype';
import { useQueryClient } from '@tanstack/react-query';
import { useCountdown } from "@/hooks/useCountdown";

interface UpcommingMeetingProps {
  getCurrentTime: () => void;
  meeting: Meeting | null;
}


const UpcomingMeetingTimer = ({ getCurrentTime, meeting }: UpcommingMeetingProps) => {
  const { hours, minutes, seconds, isFinished } = useCountdown(
    meeting?.starttime
  );

  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    getCurrentTime();

    if (!meeting || !isFinished) return;

    queryClient.setQueryData(
      ["live-meeting", user?.id],
      (oldData: Meeting[] | null | undefined) => {
        if (!oldData) return [meeting];
        const exists = oldData.some((m) => m.id === meeting.id);
        if (exists) return oldData;
        return [meeting, ...oldData];
      }
    );

    queryClient.invalidateQueries({
      queryKey: ["latest-meeting", user?.id],
    });
  }, [isFinished, meeting]);

  return (
    <h1 className='text-xl md:text-4xl text-center'>
      {!isFinished
        ? `"${meeting?.meetingtitle}" in ${hours}h ${minutes}m ${seconds}s`
        : "No Upcoming Meeting"}
    </h1>
  );
};

export default UpcomingMeetingTimer
