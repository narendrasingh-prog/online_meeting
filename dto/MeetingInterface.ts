import type {MeetingUser,Chats} from "./Meetingtype"

export interface GetUsers{
  users:MeetingUser[];
  total:number;
  page:number;
  page_limit:number;
  total_pages:number;
}

export interface GetChats{
  chats:Chats[];
  total:number;
  page:number;
  has_prev_page:boolean;
  has_next_page:boolean;
  page_limit:number;
  total_pages:number;
}

export interface GetYourMeeting<T>{
  meetings:T,
  total_count:number;
}