'use client';
import React, { memo, useMemo } from 'react';
import { Meeting } from '@/dto/Meeting';
import { MeetingService } from '@/services/MeetingService';
import { useRouter } from 'next/navigation';
import LiveMeetingItem from './LiveMeetingItem';


interface LiveMeetingProps {
  meeting: Meeting[] | null;
}

const LiveMeeting = ({ meeting }: LiveMeetingProps) => {
  const meetingService = useMemo(() => MeetingService.Client(), []); 
  const router = useRouter();

  return (
    <div className="flex flex-col my-5">
      <h1 className="text-3xl text-center bg-gray-900 rounded-md py-3">
        Live Meetings
      </h1>

      <div className="grid grid-cols-1 py-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 xl:gap-6">
        {meeting ? (
          meeting.map((meet) => (
            <LiveMeetingItem
              key={meet.id}
              meet={meet}
              meetingService={meetingService}
              router={router}
            />
          ))
        ) : (
          <div className="border p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-2">No Live Meeting</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(LiveMeeting);
