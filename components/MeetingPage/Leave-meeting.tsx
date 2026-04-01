"use client";

import React, { memo } from "react";
import { MeetingService } from "@/services/MeetingService";
import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
interface LeaveMeetingProps {
  meetingId: number;
  
}
const LeaveMeeting = ({ meetingId }: LeaveMeetingProps) => {
  const router = useRouter();
  const meetingService = MeetingService.Client();
  const {user}=useAuth();
  const leaveMeeting = useMutation({
    mutationKey: ["leave-meeting"],
    mutationFn: () => meetingService.leaveMeeting({ meetingid: meetingId,userid:user!.id }),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("successfully left meeting");
        router.push("/");
      } else {
        toast.error("something went wrong");
      }
    },
    onError: (error) => {
      console.log("something went wrong");
      toast.error("try again");
    },
  });

  const handLeaveMeeting = () => {
    leaveMeeting.mutate();
  };

  return (
    <div className="flex justify-end sm:absolute top-2 right-4 ">
      <button
        className="bg-red-600 py-4 px-2 rounded-md"
        onClick={() => handLeaveMeeting()}
      >
        Leave Meeting
      </button>
    </div>
  );
};

export default memo(LeaveMeeting);
