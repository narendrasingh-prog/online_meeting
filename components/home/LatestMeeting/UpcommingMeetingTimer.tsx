import React, { useEffect, useState } from 'react'

import { useAuth } from '@/contexts/AuthContext';
import { Meeting } from '@/dto/Meeting';
import { useQueryClient } from '@tanstack/react-query';


interface UpcommingMeetingProps {
  getCurrentTime: () => void;
  meeting: Meeting | null;
}


const UpcomingMeetingTimer = ({ getCurrentTime, meeting }: UpcommingMeetingProps) => {
  const [Upcomming, setUpcomming] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  useEffect(() => {
    const timer = setInterval(() => {
      getCurrentTime();

      if (meeting) {
        const meetingTime = new Date(meeting.starttime).getTime();
        const now = Date.now();

        const diff = meetingTime - now;
        if (diff <= 0) {
          setUpcomming("");
          queryClient.setQueryData(
            ["live-meeting", user?.id],
            (oldData: Meeting[] | null | undefined) => {

              if (!oldData) return [meeting];
              const exists = oldData.some(m => m.id === meeting.id);
              if (exists) return oldData;
              return [meeting, ...oldData];
            }
          );
          queryClient.invalidateQueries({ queryKey: ["latest-meeting", user?.id] });

          return;
        }
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        const formatted = `${hours}h ${minutes}m ${seconds}s`;
        setUpcomming(formatted);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [meeting]);

  return (
  <h1 className="glassmorphhism  max-w:-[270px] text-center text-lg font-normal  md:text-3xl ">
      {Upcomming
        ? `"${meeting?.meetingtitle}" meeting in  ${Upcomming}`
        : "No Upcomming Meeting"} </h1>
  );
};

export default UpcomingMeetingTimer
