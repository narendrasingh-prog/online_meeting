"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { Chats, Meeting } from "@/dto/Meetingtype";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { MeetingService } from "@/services/MeetingService";
import { SupabaseService } from "@/lib/supabase/SupabaseService";
import { useAuth } from "@/contexts/AuthContext";

interface ChatSectionProps {
  meeting: Meeting;
}


const ChatImage = ({ src }: { src: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative mt-2 w-[200px] h-[150px] rounded-lg overflow-hidden">

      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}


      {hasError && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-xs text-gray-400">Failed to load image</p>
        </div>
      )}


      {!hasError && (
        <Image
          unoptimized
          src={src}
          alt="chat image"
          fill
          className={`object-contain rounded-lg transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"
            }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </div>
  );
};

function ChatSection({ meeting }: ChatSectionProps) {
  const supabase = useMemo(() => SupabaseService.browser(), []);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [scrollRoot, setScrollRoot] = React.useState<HTMLDivElement | null>(
    null,
  );
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { ref: topRef, inView } = useInView({
    root: scrollRoot,
    threshold: 0,
  });

  const meetingService = MeetingService.Client();

  const {
    data: chatsData,
    fetchNextPage: fetchChatNextPage,
    hasNextPage: hasNextChatPage,
    isFetchingNextPage: isFetchingNextChatPage,
  } = useInfiniteQuery({
    queryKey: ["meeting-chats", meeting.id],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await meetingService.getChats({
        meetingid: meeting.id,
        limit: 10,
        page: pageParam,
      });
      if (!res.success) throw new Error("failed to fetch chats");
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 2 * 60 * 1000,
  });

  const chats = useMemo(() => {
    if (!chatsData) return [];

    const all = chatsData.pages.flatMap((p) => p.chats);

    const seen = new Set();
    const unique = [];

    for (const msg of all) {
      if (msg?.id && !seen.has(msg.id)) {
        seen.add(msg.id);
        unique.push(msg);
      }
    }

    return unique;
  }, [chatsData]);


  useEffect(() => {
    const channel = supabase
      .channel(`meeting-chat-${meeting.id}`)
      .on("broadcast", { event: "new_message" }, ({ payload }) => {
        const newMessage = payload.message as Chats;
        console.log("Realtime message received:", newMessage);

        queryClient.setQueryData(["meeting-chats", meeting.id], (old: any) => {
          if (!old) return old;

          const exists = old.pages.some((page: any) =>
            page.chats.some((chat: Chats) => chat.id === newMessage.id)
          );

          if (exists) return old;

          return {
            ...old,
            pages: old.pages.map((page: any, i: number) =>
              i === 0
                ? { ...page, chats: [newMessage, ...page.chats] }
                : page
            ),
          };
        });
      })
      .subscribe((status) => {
        console.log("Chat channel status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [meeting.id]);

const isLoadingRef = React.useRef(false);

useEffect(() => {
  if (scrollRef.current) {
    setScrollRoot(scrollRef.current);
  }
}, []);

useEffect(() => {
  if (!inView) return;
  if (!hasNextChatPage) return;
  if (isLoadingRef.current) return;

  isLoadingRef.current = true;

  fetchChatNextPage().finally(() => {
    setTimeout(() => {
      isLoadingRef.current = false;
    }, 300);
  });
}, [inView, hasNextChatPage, fetchChatNextPage]);

  if (!user) return null;

  const isMe = (email: string) => email === user?.email;

  return (
    <>
      <div className="shadow rounded-xl p-6 border h-[550px] flex max-w-full flex-col">
        <h2 className="text-lg font-semibold mb-4">Chat</h2>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto flex flex-col-reverse space-y-4 space-y-reverse "
        >
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex flex-col ${isMe(chat.sender_email) ? "items-end" : "items-start"}`}
            >
              <span className="text-xs text-gray-500 mb-1">
                {chat.sender_email}
              </span>

              <div
                className={`p-3 rounded-lg max-w-xs ${isMe(chat.sender_email)
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-900 rounded-bl-none"
                  }`}
              >

                {chat.message && (
                  <p className="text-sm break-words">{chat.message}</p>
                )}


                {chat.image_url && <ChatImage src={chat.image_url} />}
              </div>
            </div>
          ))}

          <div ref={topRef} className="flex items-center justify-center w-full">
            {isFetchingNextChatPage && (
              <p className="text-center text-xs text-gray-400">
                Loading older messages...
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatSection;
