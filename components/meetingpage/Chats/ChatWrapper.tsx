import React, { Suspense } from 'react'

import { Meeting } from '@/dto/Meeting'
import ChatSection from './ChatSection'
import SendMessage from './SendMessage'
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