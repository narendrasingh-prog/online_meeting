import React, { Suspense } from 'react'

import UpcomingMeeting from '@/components/Home/Upcoming-meeting'
import LoadingUpcoming from './loading'

const Upcomming = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
        <h1 className='text-3xl fold-bold'>
            Upcoming
        </h1>
        <div className='no-scrollbar overflow-y-auto'>
          <Suspense fallback={<LoadingUpcoming/>}>
          <UpcomingMeeting/>
          </Suspense>
         
        </div>

    </section>
  )
}

export default Upcomming
