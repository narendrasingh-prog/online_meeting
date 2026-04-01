"use client";

import { Meeting } from "@/dto/Meetingtype";
import { SupabaseService } from "@/lib/supabase/SupabaseService";
import { MeetingService } from "@/services/MeetingService";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { memo, useMemo, useRef } from "react";
import { toast } from "sonner";

interface SendMessageProps {
  meeting: Meeting;
}

const SendMessage = memo(({ meeting }: SendMessageProps) => {
  const meetingService = useMemo(() => MeetingService.Client(), []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const supabase = useMemo(() => SupabaseService.browser(), []);
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { message: string; image: File | null }) => {
      const res = await meetingService.sendMessage({
        meetingId: meeting.id,
        message:   data.message ?? null,
        image:     data.image   ?? null,
      });
      if (!res.success) throw new Error("Error sending message");
      return res.data;
    },
    onSuccess: (chatData) => {
      // ✅ prepend new message to first page
      queryClient.setQueryData(["meeting-chats", meeting.id], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any, index: number) =>
            index === 0
              ? { ...page, chats: [chatData, ...page.chats] }
              : page
          ),
        };
      });
       const channel = supabase.channel(`meeting-chat-${meeting.id}`);
      channel.send({
        type: "broadcast",
        event: "new_message",
        payload: { message: chatData }, // chatData = full message object from API
      });

  
      form.reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: () => toast.error("Failed to send message"),
  });

  
  const form = useForm({
    defaultValues: {
      message: "",
      image:   null as File | null,
    },
    onSubmit: async ({ value }) => {
      if (!value.message.trim() && !value.image) {
        toast.error("Please send some data");
        return;
      }
      sendMessageMutation.mutate({
        message: value.message.trim(),
        image:   value.image,
      });
    },
  });

  return (
    <div className="shadow rounded-xl p-4 border">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col md:flex-row gap-3 justify-between items-center"
      >
       
        <form.Field name="message">
          {(field) => (
            <input
              type="text"
              disabled={sendMessageMutation.isPending}
              placeholder="Send a message..."
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none"
            />
          )}
        </form.Field>

      
        <form.Field name="image">
          {(field) => (
            <input
              ref={fileInputRef}
              disabled={sendMessageMutation.isPending}
              type="file"
              accept="image/*"
              className="text-sm"
              onChange={(e) => {
                field.handleChange(e.target.files?.[0] ?? null);
              }}
            />
          )}
        </form.Field>

        
        <form.Subscribe
          selector={(state) => state.isSubmitting}
        >
          {(isSubmitting) => (
            <button
              type="submit"
              disabled={sendMessageMutation.isPending || isSubmitting}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-70"
            >
              {sendMessageMutation.isPending ? "Sending..." : "Send"}
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
});

SendMessage.displayName = "SendMessage";
export default SendMessage;