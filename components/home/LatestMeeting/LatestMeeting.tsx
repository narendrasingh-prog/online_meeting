"use client";
import  { useEffect, useState } from "react";

import { Meeting } from "@/dto/Meeting";
import UpcomingMeetingTimer from "./UpcommingMeetingTimer"
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

interface LatestMeetingProps {
  meeting: Meeting | null;
}

const LatestMeeting = ({ meeting }: LatestMeetingProps) => {
  const [time, setTime] = useState<string>();
  const [date, setDate] = useState<string>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const getCurrentTime = () => {
    const now = new Date();
    const times = now.toLocaleTimeString("en-us", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dates = new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
    }).format(now);

    setTime(times);
    setDate(dates);
  };

  useEffect(() => {
    const validateLiveMeetings = () => {
      const now = Date.now() + 5000;

      queryClient.setQueryData(
        ["live-meeting", user?.id],
        (old: Meeting[] | null | undefined) => {
          if (!old) return old;
         
          const filtered = old.filter((m) => {
            const endTime = new Date(m.endtime).getTime();
            const isExpired = endTime < now;
            console.log(endTime, now);
            if (isExpired) {
              console.log(`Removing expired meeting: ${m.meetingtitle}`);
            }
            return !isExpired;
          });

          if (filtered.length === old.length) return old;
          return filtered;
        },
      );
    };
    validateLiveMeetings();

    const interval = setInterval(validateLiveMeetings, 30 * 1000);
    return () => clearInterval(interval);
  }, [user?.id]);

  return (
    <div className=" md:h-[200px] lg:h-[300px] w-full rounded-[20px] bg-hero bg-cover">
      <div className="flex h-full flex-col max-md:px-5 justify-between py-6 max-md-py-8 lg:p-11">
        <UpcomingMeetingTimer
          meeting={meeting}
          getCurrentTime={getCurrentTime}
        />
        <div className="flex flex-col gap-2 px-10">
          <h1 className="text-2xl font-extrabold md:text-4xl lg:7xl">{time}</h1>
          <p className="text-lg font-medium md:text-2xl mt-auto text-blue-400">
            {date}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LatestMeeting;
