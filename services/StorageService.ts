// import { supabase } from "../supabaseConfig/SupabaseClient";

import { SupabaseService } from "@/lib/supabase/SupabaseService";
import { SupabaseClient } from "@supabase/supabase-js";

export class FileUpload {
  private supabase: SupabaseClient;
  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  public async storeImageFile(args: {
    bucket: string;
    id?: number;
    file: File;
  }): Promise<string> {
    const filename = `${args.id ? args.id + "/" : ""}${Date.now()}-${args.file.name}`;
    const { data, error } = await this.supabase.storage
      .from(args.bucket)
      .upload(filename, args.file);
    if (error) {
      throw { success: false, error: error.message };
    }

    return data.path;
  }
  public async getPublicUrl(args: {
    bucket: string;
    filename: string;
  }): Promise<string> {
    const { data: publicurl } = this.supabase.storage
      .from(args.bucket)
      .getPublicUrl(args.filename);
    if (!publicurl) {
      throw { success: false, error: publicurl };
    }
    return publicurl.publicUrl;
  }
  public async getSignedUrl(args: {
    bucket: string;
    filename: string;
  }): Promise<string> {
    const { data: privateurl, error } = await this.supabase.storage
      .from(args.bucket)
      .createSignedUrl(args.filename, 3600);

    if (error) {
      throw { success: false, error: error.message };
    }
   
    return privateurl.signedUrl;
  }
}
