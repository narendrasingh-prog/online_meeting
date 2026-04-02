import type {
  Chats,
  CreateMeetingRequest,
  CreateMeetingResponse,
  Meeting,
  MeetingPagination,
} from "../dto/Meeting";
import type { ApiResponse, ApiError } from "../types/ApiResponse";

import { FileUpload } from "./StorageService";
import type {
  GetChats,
  GetUsers,
  GetYourMeeting,
} from "../dto/Meeting";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseService } from "@/lib/supabase/SupabaseService";

export class MeetingService {
  private supabase: SupabaseClient;
  private fileApi: FileUpload;
  static async Server() {
    const supabase = await SupabaseService.server();
    return new MeetingService(supabase);
  }
  static Client() {
    const supabase = SupabaseService.browser();
    return new MeetingService(supabase);
  }

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.fileApi = new FileUpload(supabase);
  }

  private errorResponse(message: string, extra?: Partial<ApiError>): ApiResponse<never> {
    return {
      success: false,
      error: { message, ...(extra ?? {}) },
    };
  }

  public async createMeeting(
    data: CreateMeetingRequest,
  ): Promise<ApiResponse<CreateMeetingResponse>> {
    const { data: responseData, error } = await this.supabase.rpc(
      "create_meeting_rpc",
      {
        p_meeting_title: data.meetingtitle,
        p_start_time: new Date(data.starttime).toISOString(),
        p_end_time: new Date(data.endtime).toISOString(),
      },
    );

    if (error) {
      return this.errorResponse(error.message, {
        code: (error as unknown as { code?: string }).code,
      });
    }

 
    return {
      success: true,
      data: responseData as CreateMeetingResponse,
      message: "data fetched successfully",
    } as ApiResponse<CreateMeetingResponse>;
  }
  public async getMeeting(args: {
    meeting_url: string;
  }): Promise<ApiResponse<CreateMeetingResponse>> {
    const { data: meetingdetails, error } = await this.supabase.rpc(
      "get_meeting_details",
      {
        p_meeting_link: args.meeting_url,
      },
    );
    if (error) {
      return this.errorResponse(error.message, {
        code: (error as unknown as { code?: string }).code,
      });
    }
    console.log(meetingdetails)
    return {
      success: true,
      data: meetingdetails,
      message: "fetched all meeting details",
    } as ApiResponse<CreateMeetingResponse>;
  }
  public async getLatestMeeting(): Promise<ApiResponse<Meeting>> {
   
    const { data: meetingdetails, error } =
      await this.supabase.rpc("get_latest_meeting");
    if (error) {
      return this.errorResponse(error.message, {
        code: (error as unknown as { code?: string }).code,
      });
    }
    return {
      success: true,
      data: meetingdetails,
      message: "fetched all meeting details",
    } as ApiResponse<Meeting>;
  }
  public async getLiveMeeting(): Promise<ApiResponse<Meeting[]>> {
    const { data: meetingdetails, error } =
      await this.supabase.rpc("get_live_meetings");
    if (error) {
      return this.errorResponse(error.message, {
        code: (error as unknown as { code?: string }).code,
      });
    }
    // console.log(meetingdetails)
    return {
      success: true,
      data: meetingdetails,
      message: "fetched all meeting details",
    } as ApiResponse<Meeting[]>;
  }
  public async joinMeeting(
    data: {meetingurl:string},
  ): Promise<ApiResponse<{meeting: number}>> {
    const { data: responsemeeting, error } = await this.supabase.rpc(
      "join_meeting_through_link",
      {
        meeting_url: data.meetingurl,
      },
    );
    if (error) {
      return this.errorResponse(error.message, {
        code: (error as unknown as { code?: string }).code,
      });
    }
    return {
      success: true,
      data: responsemeeting,
      message: "data fetched successfully",
    } as ApiResponse<{meeting: number}>;
  }
  public async sendMessage(args: {
    meetingId: number;
    message: string | null;
    image: File | null;
  }): Promise<ApiResponse<Chats>> {
    let imageurl: string | null = null;
    let signedurl: string | null = null;

  
    if (args.image) {
      imageurl = await this.fileApi.storeImageFile({
        file: args.image,
        id: args.meetingId,
        bucket: "Meetings",
      });

      if (!imageurl) {
        return this.errorResponse("cannot store image in Storage");
      }

      signedurl = await this.fileApi.getSignedUrl({
        bucket: "Meetings",
        filename: imageurl,
      });

      if (!signedurl) {
        return this.errorResponse("cannot get signed url");
      }
    }

    const { data: messageData, error } = await this.supabase.rpc(
      "send_message_in_the_meeting",
      {
        p_meeting_id: args.meetingId,
        p_meeting_message: args.message,
        p_image_url: imageurl,  
      },
    );

    if (error) {
      return this.errorResponse(error.message, {
        code: (error as unknown as { code?: string }).code,
      });
    }

    return {
      success: true,
      data: { ...messageData, image_url: signedurl ?? null },
      message: "successfully inserted",
    };
  }
  public async getUsers(args: {
    meetingid: number;
    page: number;
    limit: number;
  }): Promise<ApiResponse<GetUsers>> {
    const { data: meetingusers, error } = await this.supabase.rpc(
      "get_all_users_in_meeting",
      {
        p_meeting_id: args.meetingid,
        p_page_no: args.page,
        p_page_limit: args.limit,
      },
    );
    if (error) {
      return this.errorResponse(error.message, {
        code: (error as unknown as { code?: string }).code,
      });
    }
    return {
      success: true,
      data: meetingusers,
      message: "data fetched successfully",
    };
  }
  public async getChats(args: {
    meetingid: number;
    page: number;
    limit: number;
  }): Promise<ApiResponse<GetChats>> {
    const { data: meetingchats, error } = await this.supabase.rpc(
      "get_chats_from_meeting",
      {
        p_meeting_id: args.meetingid,
        p_page_no: args.page,
        p_page_limit: args.limit,
      },
    );
    if (error) {
      return this.errorResponse(error.message, {
        code: (error as unknown as { code?: string }).code,
      });
    }
    if (meetingchats.chats.length > 0) {
      for (const obj of meetingchats.chats) {
        if (obj.image_url) {
          obj.image_url = await this.fileApi.getSignedUrl({
            bucket: "Meetings",
            filename: obj.image_url,
          });
        }
      }
    }
    return { success: true, data: meetingchats, message: "fetched data" };
  }
  public async joinYourCreatedMeeting(args: {
    meetingid: number;
  }): Promise<ApiResponse<GetYourMeeting<Meeting>>> {
    const { data: meetingdetails, error } = await this.supabase.rpc(
      "join_your_created_meeting",
      {
        meeting_id: args.meetingid,
      },
    );
    if (error) {
      console.log(error);
      return this.errorResponse(error.message, {
        code: (error as unknown as { code?: string }).code,
      });
    }
    // console.log(meetingdetails)
    return {
      success: true,
      data: meetingdetails,
      message: "meeting details for host",
    };
  }
  public async getAllCreatedMeeting(args: {
    p_limit: number;
    p_page: number;
  }): Promise<ApiResponse<MeetingPagination<Meeting>>> {
    const { data: meetingdetails, error } = await this.supabase.rpc(
      "get_previous_meetings",
      { p_limit: args.p_limit, p_page: args.p_page },
    );
    if (error) {
      return this.errorResponse("cannot get users meeting");
    }
    return {
      success: true,
      data: meetingdetails as MeetingPagination<Meeting>,
      message: "got all meetings data",
    };
  }
  public async getAllUpcommingMeeting(args: {
    p_limit: number;
    p_page: number;
  }): Promise<ApiResponse<MeetingPagination<Meeting>>> {
    const { data: meetingdetails, error } = await this.supabase.rpc(
      "get_upcoming_meetings",
      { p_limit: args.p_limit, p_page: args.p_page },
    );
    console.log("get meeting")
    if (error) {
      return this.errorResponse("cannot get users meeting");
    }
    return {
      success: true,
      data: meetingdetails ,
      message: "got all meetings data",
    };
  }
  public async leaveMeeting(args: {
    meetingid: number,userid:string
  }): Promise<ApiResponse<boolean>> {
    console.log(args.meetingid,args.userid);
    const { data: isleaved, error } = await this.supabase.rpc("leave_meeting", {
      meeting_id: args.meetingid,
      user_id:args.userid
    });
    if (error) {
      return this.errorResponse(error.message, {
        code: (error as unknown as { code?: string }).code,
      });
    }
    return {
      success: true,
      data: isleaved,
      message: "meeting details ",
    };
  }
  public async isUserInMeeting(args: {
    meetingId: number;
  }): Promise<ApiResponse<{ is_member: boolean }>> {
    const { data, error } = await this.supabase.rpc("is_user_in_meeting", 
      { p_meeting_id: args.meetingId, });
    if (error) {
      return this.errorResponse(error.message, {
        code: (error as unknown as { code?: string }).code,
      });
    }
    return {
      success: true,
      data: data.is_member,
      message: "checked if user is in meeting",
    };
  }
  public async automaticLeaveMeeting():Promise<ApiResponse<boolean>>{
    const {data:left,error}=await this.supabase.rpc("remove_user_from_active_meetings");
     if (error) {
      return this.errorResponse(error.message, {
        code: (error as unknown as { code?: string }).code,
      });
    }
    return {
      success:true,
      data:left,
      message:"sucessfully left the active meeting"
    }
  }

}