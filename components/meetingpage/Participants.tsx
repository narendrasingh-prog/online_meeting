"use client";

import { Meeting } from "@/dto/Meeting";
import { MeetingService } from "@/services/MeetingService";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";

interface ParticipantsProps {
  meeting: Meeting;
}

const Participants = ({ meeting }: ParticipantsProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const meetingService = MeetingService.Client();
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
  } = useInfiniteQuery({
    queryKey: ["meeting-users", meeting.id],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await meetingService.getUsers({
        meetingid: meeting.id,
        limit: 1,
        page: pageParam as number,
      });
      if (!res.success) throw new Error("Failed");
      return res.data;
    },
    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.page > 1 ? firstPage.page - 1 : undefined,
    staleTime: 60 * 1000,
  });
  const totalPages = data?.pages[0]?.total_pages ?? 1;
  const canGoNext = currentPageNo < totalPages;
  const canGoPrevious = currentPageNo > 1;

  const handleNext = async () => {
    if (!canGoNext) return;

    const nextPageIndex = currentPageNo;
    const hasCachedNext = !!data?.pages[nextPageIndex];
    const needsFetch = !hasCachedNext && hasNextPage;

    if (needsFetch) {
      await fetchNextPage();
    }

    setCurrentPageNo((prev) => prev + 1);
  };

  const handlePrevious = async () => {
    if (!canGoPrevious) return;

    const prevPageIndex = currentPageNo - 2;
    if (prevPageIndex >= 0 && data?.pages[prevPageIndex]) {
      setCurrentPageNo((prev) => prev - 1);
      return;
    }

    await fetchPreviousPage();
    setCurrentPageNo((prev) => prev - 1);
  };

  const prevDisabled = !canGoPrevious || isFetchingPreviousPage;
  const nextDisabled = !canGoNext || isFetchingNextPage;

  const currentPage = data?.pages[currentPageNo - 1];
  const participants = currentPage?.users ?? [];
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className=" lg:hidden  bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Participants
      </button>
      <div
        className={`
        fixed lg:relative top-0 right-0 h-full min-w-[250px] z-10
        bg-black text-white border-l border-gray-700
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}
        lg:translate-x-0 w-[300px] py-10 px-5
        flex flex-col
        `}
      >
        <h2 className="text-lg font-semibold mb-4">Participants</h2>

        <div className="flex flex-col justify-between h-full">
          <div className="space-y-3">
            {participants.map((user) => (
              <div
                key={user.email}
                className="flex justify-between items-center border p-3 rounded-lg"
              >
                <p className="text-sm">{user.email}</p>

                <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-auto flex justify-between">
            <button
              disabled={prevDisabled}
              className="bg-gray-500 px-2 rounded-md disabled:opacity-50"
              onClick={handlePrevious}
            >
              {isFetchingPreviousPage ? "Loading..." : "previous"}
            </button>
            <button
              disabled={nextDisabled}
              className="bg-gray-500 px-2 rounded-md disabled:opacity-50"
              onClick={handleNext}
            >
              {isFetchingNextPage ? "Loading..." : "next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Participants;
