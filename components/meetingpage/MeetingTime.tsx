"use client";

import { useCallback } from "react";
import { Meeting } from "@/dto/Meeting";
import CountdownTimer from "@/hooks/useCountdown";

interface MeetingTimeProps {
  meeting: Meeting;
  onleave: () => void;
}

const MeetingTime = ({ meeting, onleave }: MeetingTimeProps) => {
  const handleFinish = useCallback(() => {
    onleave();
  }, [onleave]);

  return (
    <CountdownTimer targetTime={meeting.endtime} onFinish={handleFinish}>
      {({ hours, minutes, seconds }) => (
        <div>
          <h1>
            Time Left {hours}:{minutes}:{seconds}
          </h1>
        </div>
      )}
    </CountdownTimer>
  );
};

export default MeetingTime;
