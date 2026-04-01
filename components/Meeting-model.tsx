"use client";

import React, { useState, useEffect, memo, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

export type MeetingType =
  | { type: "Scheduled"; title: string; start: string; end: string }
  | { type: "InstantMeeting"; title: string; hours: number }
  | { type: "JoinMeeting"; link: string }
  | { type: "Idle" };

interface MeetingModelProps {
  open: boolean;
  loading: boolean;
  close: () => void;
  className?: string;
  buttonText?: string;
  meetingType: MeetingType["type"];
  handleClick: (data: MeetingType) => void;
}


// InstantMeeting form
const InstantMeetingForm = memo(({
  loading,
  buttonText,
  className,
  onSubmit,
}: {
  loading: boolean;
  buttonText?: string;
  className?: string;
  onSubmit: (data: { title: string; hours: number }) => void;
}) => {
  const [title, setTitle] = useState("");
  const [hours, setHours] = useState(1);

  

  return (
    <div className={cn("flex flex-col justify-between gap-6", className)}>
      <input
        type="text"
        value={title}
        disabled={loading}
        
        placeholder="Define meeting title"
        onChange={(e) => setTitle(e.target.value)} 
        className="py-2 px-4"
      />
      <select
        value={hours}
        disabled={loading}
        onChange={(e) => setHours(Number(e.target.value))}
        className="p-2 px-3"
      >
        {[1, 2, 3, 4, 5].map((h) => (
          <option key={h} value={h}>{h} hour{h > 1 ? "s" : ""}</option>
        ))}
      </select>
      <button
        disabled={loading}
        onClick={() => onSubmit({ title, hours })}
        className={cn("mt-auto bg-blue-500 py-2 rounded-md", loading && "bg-gray-600 cursor-not-allowed opacity-50")}
      >
        {loading ? "Loading..." : buttonText}
      </button>
    </div>
  );
});
InstantMeetingForm.displayName = "InstantMeetingForm";

// JoinMeeting form
const JoinMeetingForm = memo(({
  loading,
  buttonText,
  className,
  onSubmit,
}: {
  loading: boolean;
  buttonText?: string;
  className?: string;
  onSubmit: (data: { link: string }) => void;
}) => {
  const [link, setLink] = useState("");



  return (
    <div className={cn("flex flex-col justify-between gap-6", className)}>
      <input
        type="text"
        disabled={loading}
        value={link}
        placeholder="Enter meeting link"
        onChange={(e) => setLink(e.target.value)} 
        className="py-2 px-4"
      />
      <button
        disabled={loading}
        onClick={() => onSubmit({ link })}
        className="mt-auto bg-blue-500 py-2 rounded-md"
      >
        {loading ? "Loading..." : buttonText}
      </button>
    </div>
  );
});
JoinMeetingForm.displayName = "JoinMeetingForm";

// Scheduled form
const ScheduledForm = memo(({
  loading,
  buttonText,
  className,
  onSubmit,
}: {
  loading: boolean;
  buttonText?: string;
  className?: string;
  onSubmit: (data: { title: string; start: string; end: string }) => void;
}) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd]     = useState("");

  

  return (
    <div className={cn("flex flex-col justify-between gap-6", className)}>
      <input
        type="text"
        value={title}
        disabled={loading}
        placeholder="Enter meeting title"
        onChange={(e) => setTitle(e.target.value)}
        className="py-2 px-4"
      />
      <input
        type="datetime-local"
        value={start}
        disabled={loading}
        onChange={(e) => setStart(e.target.value)}
        className="py-2 px-4"
      />
      <input
        type="datetime-local"
        disabled={loading}
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        className="py-2 px-4"
      />
      <button
        disabled={loading}
        onClick={() => onSubmit({ title, start, end })}
        className="mt-auto bg-blue-500 py-2 rounded-md"
      >
        {loading ? "Loading..." : buttonText}
      </button>
    </div>
  );
});
ScheduledForm.displayName = "ScheduledForm";


const MeetingModel = memo(({
  open,
  loading,
  close,
  className,
  buttonText,
  meetingType,
  handleClick,
}: MeetingModelProps) => {

  // ✅ stable callbacks — memo on forms works correctly
  const handleInstantSubmit = useCallback((data: { title: string; hours: number }) => {
    handleClick({ type: "InstantMeeting", ...data });
  }, [handleClick]);

  const handleJoinSubmit = useCallback((data: { link: string }) => {
    handleClick({ type: "JoinMeeting", ...data });
  }, [handleClick]);

  const handleScheduledSubmit = useCallback((data: { title: string; start: string; end: string }) => {
    handleClick({ type: "Scheduled", ...data });
  }, [handleClick]);

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="flex flex-col gap-6 max-w-[500px] text-white p-5 py-10">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Meeting</DialogTitle>
          </VisuallyHidden>

          {/* ✅ Only the active form mounts — others are completely unmounted */}
          {meetingType === "InstantMeeting" && (
            <InstantMeetingForm
              loading={loading}
              buttonText={buttonText}
              className={className}
              onSubmit={handleInstantSubmit}
            />
          )}
          {meetingType === "JoinMeeting" && (
            <JoinMeetingForm
              loading={loading}
              buttonText={buttonText}
              className={className}
              onSubmit={handleJoinSubmit}
            />
          )}
          {meetingType === "Scheduled" && (
            <ScheduledForm
              loading={loading}
              buttonText={buttonText}
              className={className}
              onSubmit={handleScheduledSubmit}
            />
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
});

MeetingModel.displayName = "MeetingModel";
export default MeetingModel;
