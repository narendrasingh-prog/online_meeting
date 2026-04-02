"use client";
import { Meeting } from "@/dto/Meeting";
import { formatTime } from "@/lib/utils";
import MeetingTime from "./MeetingTime";
import { memo, Suspense } from "react";
interface MeetingDetailsProps {
  meeting: Meeting | null;
  onleave: () => void;
}
const MeetingDetails = ({ meeting, onleave }: MeetingDetailsProps) => {
  return (
    <div className="flex-1">
      <div className=" shadow rounded-xl p-6 border">
        <Suspense fallback={<h1>Loading meeting time...</h1>}>
          <MeetingTime meeting={meeting!} onleave={onleave} />
        </Suspense>
        <h2 className="text-xl font-semibold mb-2">Meeting Details</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p>
            <span className="font-medium">Meeting ID:</span>
            {meeting?.id}
          </p>
          <p>
            <span className="font-medium">Title:</span> {meeting?.meetingtitle}
          </p>
          <p>
            <span className="font-medium">Created By:</span> {meeting?.host}
          </p>
          <p>
            <span className="font-medium">start Time:</span>{" "}
            {formatTime(meeting?.starttime ?? "")}
            <br /> <span className="font-medium">End Time:</span>{" "}
            {formatTime(meeting?.endtime ?? "")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(MeetingDetails);
