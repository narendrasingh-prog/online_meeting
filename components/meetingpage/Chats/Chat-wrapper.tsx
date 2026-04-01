import React, { Suspense } from 'react'
import ChatSection from './Chat-section'
import SendMessage from './Send-message'
import { Meeting } from '@/dto/Meetingtype'
interface ChatWrapperProps{
  meeting:Meeting
}
const ChatWrapper = ({meeting}:ChatWrapperProps) => {
  return (
    <>
    <Suspense fallback={<h1>fetching chats</h1>}>
    <ChatSection meeting={meeting}/>
    </Suspense>
    <SendMessage meeting={meeting}/>
    </>
  )
}

export default ChatWrapper