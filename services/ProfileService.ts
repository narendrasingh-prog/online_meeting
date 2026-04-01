import { SupabaseClient } from "@supabase/supabase-js";
import { FileUpload } from "./FileUpload";
import { SupabaseService } from "@/lib/supabase/SupabaseService";
import { ApiError, ApiResponse } from "@/types/ApiResponse";
import { UserProfile } from "@/dto/Profiletype";

export class ProfileService {
  private supabase: SupabaseClient;
  private fileApi: FileUpload;

  static async Server() {
    const supabase = await SupabaseService.server();
    return new ProfileService(supabase);
  }

  static Client() {
    const supabase = SupabaseService.browser();
    return new ProfileService(supabase);
  }

  private constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.fileApi = new FileUpload(supabase);
  }

  private errorResponse(message: string, extra?: Partial<ApiError>): ApiResponse<never> {
    return { success: false, error: { message, ...(extra ?? {}) } };
  }

  private async buildAvatarUrl(file?: File): Promise<string | null> {
    if (!file) return null;

    const path = await this.fileApi.storeImageFile({
      bucket: "avatars",
      file,
      
    });

    if (!path) {
      throw new Error("avatar_path_missing");
    }

    
    return path;
  }

  public async getProfile(): Promise<ApiResponse<UserProfile>> {
    const { data, error } = await this.supabase.rpc("get_user_profile");
    
    if (error) {
      return this.errorResponse(error.message, {
        code: (error as unknown as { code?: string }).code,
      });
    }
    let signedUrl :string |null=null;
    if(data.avatar_url){
    signedUrl = await this.fileApi.getSignedUrl({
      bucket: "avatars",
      filename: data.avatar_url,
    });
    
    if(!signedUrl){
      return this.errorResponse("Failed to retrieve avatar URL", {
        code: "avatar_url_retrieval_failed",
      });
    }}


    return {
      success: true,
      data: { ...data, avatar_url: signedUrl } as UserProfile,
      message: "Profile fetched successfully",
    };
  }

  public async updateProfile(args: {
  fullname: string;
  avatarFile?: File;
}): Promise<ApiResponse<UserProfile>> {
  let path: string | null = null;
  let signedUrl: string | null = null;

  // ✅ Only run avatar upload if file is provided
  if (args.avatarFile) {
    try {
      path = await this.buildAvatarUrl(args.avatarFile);

      if (!path) {
        return this.errorResponse("Failed to upload avatar", {
          code: "avatar_upload_failed",
        });
      }

      signedUrl = await this.fileApi.getSignedUrl({
        bucket: "avatars",
        filename: path,
      });

      if (!signedUrl) {
        return this.errorResponse("Failed to retrieve avatar URL", {
          code: "avatar_url_missing",
        });
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : "Avatar upload failed";
      return this.errorResponse("Failed to upload avatar", {
        code: "avatar_upload_failed",
        errorName: error instanceof Error ? error.name : "UnknownError",
        errorObj: error,
        message,
      });
    }
  }

  // ✅ Update profile — path is null if no avatar uploaded
  const { data, error } = await this.supabase.rpc("update_user_profile", {
    p_fullname: args.fullname,
    p_avatar_url: path,  
  });

  if (error) {
    return this.errorResponse(error.message, {
      code: (error as unknown as { code?: string }).code,
    });
  }

  if (!data) {
    return this.errorResponse("No data returned from profile update", {
      code: "no_data_returned",
    });
  }

  
  return {
    success: true,
    data: {
      ...data,
      avatar_url: signedUrl ?? data.avatar_url ?? null, 
    } as UserProfile,
    message: "Profile updated successfully",
  };
}
}
