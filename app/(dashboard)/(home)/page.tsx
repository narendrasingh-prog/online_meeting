'use server'
import React, { Suspense } from 'react'


import { MeetingService } from '@/services/MeetingService';
import LoadingPage from './loading';
import HomePage from '@/components/Home/Home-page';


const Home = async () => {

  const meetingService = await MeetingService.Server();
  const meeting = await meetingService.getLatestMeeting();

  const livemeeting = await meetingService.getLiveMeeting();
  const liveMeet = livemeeting.success ? livemeeting.data : null;
  const latestMeet = meeting.success ? meeting.data : null;

  return (
    <div>

      <Suspense fallback={<LoadingPage />}>
        <HomePage latestmeeting={latestMeet} livemeeting={liveMeet} />
      </Suspense>
      

    </div>
  )
}

export default Home
