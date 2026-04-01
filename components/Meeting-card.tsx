import React from "react";


import { Meeting } from "@/dto/Meetingtype";
import Link from "next/link";
type MeetingCardProps = {
  meetings: Meeting[];
};

const MeetingCard = ({ meetings }: MeetingCardProps) => {
  const formatTime = (time: string) => {
    return new Date(time).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };
  return (
    <>
      {meetings.map((meeting, index) => (
        <div
          key={index}
          className="bg-slate-800 text-white p-5 rounded-lg shadow-lg flex flex-col justify-between gap-4 hover:shadow-xl transition-shadow"
        >
          <h2 className="text-xl font-bold">{meeting.meetingtitle.substring(0,14)}</h2>

          <p className="text-sm text-gray-300">
            <span className="font-semibold">Start:</span>{" "}
            {formatTime(meeting.starttime)} <br />
            <span className="font-semibold">End:</span>{" "}
            {formatTime(meeting.endtime)}
          </p>

          <p className="text-sm text-gray-400">
            <span className="font-semibold">Host:</span> {meeting.host}
          </p>

          {Date.now()>new Date(meeting.starttime).getTime() && Date.now()<new Date(meeting.endtime).getTime()  &&<Link
            href={`/meeting/${encodeURIComponent(meeting.meetinglink)}`}
            
            rel="noopener noreferrer"
            className="mt-2 inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-center transition-colors"
          >
            Join Meeting
          </Link>}
        </div>
      ))}
    </>
  );
};

export default MeetingCard;
