"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { Chats, Meeting } from "@/dto/Meeting";
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
          className={`object-contain rounded-lg transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
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
 
  const supabase = SupabaseService.browser();


  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);

 
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // ✅ NEEDED: prevents multiple simultaneous fetchNextPage calls
  const isLoadingRef = useRef(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const meetingService = MeetingService.Client();


  const { ref: topRef, inView } = useInView({
    root: scrollRoot,
    threshold: 0,
    skip: !scrollRoot,
  });


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
        limit: 6, 
        page: pageParam,
      });
      if (!res.success) throw new Error("failed to fetch chats");
      return res.data;
    },
    initialPageParam: 1,
    // ✅ NEEDED: tells react-query whether another page exists
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 2 * 60 * 1000,
  });

  // ✅ NEEDED: flattens all pages into a single array and removes duplicates.
  // Duplicates can appear when realtime pushes a message that was already
  // fetched in the next paginated call.
  const chats = useMemo(() => {
    if (!chatsData) return [];
    const seen = new Set();
    const unique: Chats[] = [];
    for (const msg of chatsData.pages.flatMap((p) => p.chats)) {
      if (msg?.id && !seen.has(msg.id)) {
        seen.add(msg.id);
        unique.push(msg);
      }
    }
    return unique;
  }, [chatsData]);

  // ✅ NEEDED: sets scrollRoot once the div is mounted so useInView
  // can use it as the intersection root instead of the viewport
  useEffect(() => {
    if (scrollRef.current) {
      setScrollRoot(scrollRef.current);
    }
  }, []);

  // ✅ NEEDED: Supabase realtime listener — appends new incoming messages
  // to the top of page[0] without refetching all pages
  useEffect(() => {
    const channel = supabase
      .channel(`meeting-chat-${meeting.id}`)
      .on("broadcast", { event: "new_message" }, ({ payload }) => {
        const newMessage = payload.message as Chats;

        queryClient.setQueryData(["meeting-chats", meeting.id], (old: any) => {
          if (!old) return old;

          // prevent duplicate if already in cache
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [meeting.id]);

  // ✅ NEEDED: triggers fetchNextPage when the sentinel div
  // (topRef) scrolls into view inside the scroll container.
  // Guards prevent duplicate concurrent fetches.
  useEffect(() => {
    if (!inView) return;             // sentinel not visible, do nothing
    if (!hasNextChatPage) return;    // no more pages to load
    if (isLoadingRef.current) return; // already fetching, skip

    isLoadingRef.current = true;
    fetchChatNextPage().finally(() => {
      isLoadingRef.current = false;  // ✅ unlock immediately, no setTimeout needed
    });
  }, [inView, hasNextChatPage, fetchChatNextPage]);

  if (!user) return null;

  const isMe = (email: string) => email === user?.email;

  return (
    <div className="shadow rounded-xl p-6 border h-[550px] flex max-w-full flex-col">
      <h2 className="text-lg font-semibold mb-4">Chat</h2>

      {/*
        ✅ flex-col-reverse: renders newest messages at the bottom visually.
        This means the sentinel div (topRef) appears at the TOP of the chat,
        so scrolling UP triggers it to load older messages.
      */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto flex flex-col-reverse space-y-4 space-y-reverse"
      >
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex flex-col ${
              isMe(chat.sender_email) ? "items-end" : "items-start"
            }`}
          >
            <span className="text-xs text-gray-500 mb-1">
              {chat.sender_email}
            </span>
            <div
              className={`p-3 rounded-lg max-w-xs ${
                isMe(chat.sender_email)
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

        {/*
          ✅ NEEDED: sentinel element — sits at the top of the list (visually)
          because of flex-col-reverse. When user scrolls up and this div
          enters the viewport of scrollRoot, inView becomes true
          and fetchNextPage is triggered.
        */}
        <div ref={topRef} className="flex items-center justify-center w-full py-1">
          {isFetchingNextChatPage && (
            <p className="text-center text-xs text-gray-400">
              Loading older messages...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatSection;