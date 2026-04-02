"use client";

import React, { memo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";

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
const InstantMeetingForm = memo(
  ({
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
    const form = useForm({
      defaultValues: {
        title: "",
        hours: 1,
      },
      onSubmit: ({ value }) => {
        onSubmit(value);
      },
    });

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {" "}
        <div className={cn("flex flex-col justify-between gap-6", className)}>
          <form.Field name="title">
            {(field) => (
              <input
                type="text"
                value={field.state.value}
                disabled={loading}
                placeholder="Define meeting title"
                onChange={(e) => field.handleChange(e.target.value)}
                className="py-2 px-4"
              />
            )}
          </form.Field>
          <form.Field name="hours">
            {(field) => (
              <select
                value={field.state.value}
                disabled={loading}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="p-2 px-3"
              >
                {[1, 2, 3, 4, 5].map((h) => (
                  <option key={h} value={h}>
                    {h} hour{h > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            )}
          </form.Field>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <button
                type="submit"
                disabled={loading || isSubmitting}
                className={cn(
                  "mt-auto bg-blue-500 py-2 rounded-md",
                  (loading || isSubmitting) &&
                    "bg-gray-600 cursor-not-allowed opacity-50",
                )}
              >
                {isSubmitting || loading ? "Loading..." : buttonText}
              </button>
            )}
          </form.Subscribe>
        </div>
      </form>
    );
  },
);
InstantMeetingForm.displayName = "InstantMeetingForm";

// JoinMeeting form
const JoinMeetingForm = memo(
  ({
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
    // const [link, setLink] = useState("");
    const form = useForm({
      defaultValues: {
        link: "",
      },
      onSubmit: ({ value }) => {
        onSubmit(value);
      },
    });

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className={cn("flex flex-col justify-between gap-6", className)}>
          <form.Field name="link">
            {(field) => (
              <input
                type="text"
                disabled={loading}
                value={field.state.value}
                placeholder="Enter meeting link"
                onChange={(e) => field.handleChange(e.target.value)}
                className="py-2 px-4"
              />
            )}
          </form.Field>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <button
                disabled={loading || isSubmitting}
                className={cn(
                  "mt-auto bg-blue-500 py-2 rounded-md",
                  (loading || isSubmitting) &&
                    "bg-gray-600 cursor-not-allowed opacity-50",
                )}
              >
                {loading || isSubmitting ? "Loading..." : buttonText}
              </button>
            )}
          </form.Subscribe>
        </div>
      </form>
    );
  },
);
JoinMeetingForm.displayName = "JoinMeetingForm";

const ScheduledForm = memo(
  ({
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
    const form = useForm({
      defaultValues: {
        title: "",
        start: "",
        end: "",
      },
      onSubmit: ({ value }) => onSubmit(value),
    });

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className={cn("flex flex-col justify-between gap-6", className)}>
          <form.Field name="title">
            {(field) => (
              <input
                type="text"
                value={field.state.value}
                disabled={loading}
                placeholder="Enter meeting title"
                onChange={(e) => field.handleChange(e.target.value)}
                className="py-2 px-4"
              />
            )}
          </form.Field>

          <form.Field name="start">
            {(field) => (
              <input
                type="datetime-local"
                value={field.state.value}
                disabled={loading}
                onChange={(e) => field.handleChange(e.target.value)}
                className="py-2 px-4"
              />
            )}
          </form.Field>

          <form.Field name="end">
            {(field) => (
              <input
                type="datetime-local"
                value={field.state.value}
                disabled={loading}
                onChange={(e) => field.handleChange(e.target.value)}
                className="py-2 px-4"
              />
            )}
          </form.Field>

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <button
                type="submit"
                disabled={loading || isSubmitting}
                className={cn(
                  "mt-auto bg-blue-500 py-2 rounded-md",
                  (loading || isSubmitting) &&
                    "bg-gray-600 cursor-not-allowed opacity-50",
                )}
              >
                {isSubmitting || loading ? "Loading..." : buttonText}
              </button>
            )}
          </form.Subscribe>
        </div>
      </form>
    );
  },
);
ScheduledForm.displayName = "ScheduledForm";

const MeetingModel = memo(
  ({
    open,
    loading,
    close,
    className,
    buttonText,
    meetingType,
    handleClick,
  }: MeetingModelProps) => {
    const handleInstantSubmit = useCallback(
      (data: { title: string; hours: number }) => {
        handleClick({ type: "InstantMeeting", ...data });
      },
      [handleClick],
    );

    const handleJoinSubmit = useCallback(
      (data: { link: string }) => {
        handleClick({ type: "JoinMeeting", ...data });
      },
      [handleClick],
    );

    const handleScheduledSubmit = useCallback(
      (data: { title: string; start: string; end: string }) => {
        handleClick({ type: "Scheduled", ...data });
      },
      [handleClick],
    );

    return (
      <Dialog open={open} onOpenChange={close}>
        <DialogContent className="flex flex-col gap-6 max-w-[500px] text-white p-5 py-10">
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>Meeting</DialogTitle>
            </VisuallyHidden>

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
  },
);

MeetingModel.displayName = "MeetingModel";
export default MeetingModel;
