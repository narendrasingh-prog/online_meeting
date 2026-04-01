

export interface CreateMeetingRequest {
  meetingtitle: string;
  starttime: string;
  endtime: string;
}

export interface Meeting {
  id:number;
  host: string;
  meetinglink: string;
  meetingpassword: string;
  meetingtitle: string;
  starttime: string;
  endtime: string;
}
export interface MeetingUser {
  id: string;
  email: string;
  role: string;
}
export interface Chats {
  id:number;
  sender_id: string;
  sender_email:string;
  message: string;
  image_url?: string | null;
}

export interface CreateMeetingResponse {
  meeting: Meeting;
}

export interface Message {
  meetingId: number;
  message: string;
  image: File | null;
}



export interface MeetingPagination<T>{
  meetings:T[];
  total:number;
  page:number;
  page_limit:number;
  total_pages:number;
  next_page:number;
  previous_page:number;
  has_next:boolean;
  has_previous:boolean;
  
}
