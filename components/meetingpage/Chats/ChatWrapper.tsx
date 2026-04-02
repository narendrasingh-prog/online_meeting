import React, { Suspense } from 'react'
import ChatSection from './ChatSection'
import SendMessage from './SendMessage'
import { Meeting } from '@/dto/Meeting'
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