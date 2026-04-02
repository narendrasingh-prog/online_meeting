"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Meeting } from "@/dto/Meeting";
interface MeetingTimeProps {
  meeting: Meeting;
  onleave:()=>void
}

const getInitialTimeLeft = (meeting?: Meeting) => {
  if (!meeting?.endtime) return 0;
  const endTime = new Date(meeting.endtime).getTime();
  return Math.max(endTime - Date.now(), 0);
};

const MeetingTime = ({ meeting,onleave }: MeetingTimeProps) => {
  const initialTimeLeft = useMemo(() => getInitialTimeLeft(meeting), [meeting]);
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const [autoLeaveTriggered, setAutoLeaveTriggered] = useState(false);

  useEffect(() => {
    if (!meeting?.endtime) return;

    const endTime = new Date(meeting.endtime).getTime();

    const updateTimeLeft = () => {
      const now = Date.now();
      const diff = Math.max(endTime - now, 0);
      setTimeLeft(diff);
    };

    updateTimeLeft();

    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [meeting]);

  useEffect(()=>{
    if (autoLeaveTriggered || timeLeft > 1000) return;
    setAutoLeaveTriggered(true);
    onleave();
  },[timeLeft, autoLeaveTriggered, onleave]);

  const hours = Math.floor(timeLeft / 1000 / 60 / 60);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div>
      <h1>
        Time Left {hours}:{minutes}:{seconds}
      </h1>
    </div>
  );
};

export default MeetingTime;
