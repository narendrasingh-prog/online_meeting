import type { AuthError, SupabaseClient, Session, User } from "@supabase/supabase-js";
import { ApiResponse } from "@/types/ApiResponse";
import { SupabaseService } from "@/lib/supabase/SupabaseService";
import { AuthUser } from "@/types/Auth";

export class AuthService {
  private supabase: SupabaseClient;

  static async Server() {
    const supabase = await SupabaseService.server();
    return new AuthService(supabase);
  }
  static Client() {
    const supabase = SupabaseService.browser();
    return new AuthService(supabase);
  }

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async signUp(args: AuthUser): Promise<ApiResponse<Partial<AuthUser>>> {
    const { data, error } = await this.supabase.auth.signUp({
      email: args.email,
      password: args.password,
    });
    if (error || !data.user) {
      return {
        success: false,
        error: { message: error?.message ?? "User not created" },
      };
    }
    return {
      success: true,
      data: {
        email: data.user.email ?? "",
      },
      message: "user signed up successfully",
    };
  }
  async signIn(args: AuthUser): Promise<ApiResponse<Partial<AuthUser>>> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: args.email,
      password: args.password,
    });
    if (error || !data) {
      return {
        success: false,
        error: { message: error?.message ?? "User not created" },
      };
    }
    return {
      success: true,
      data: {
        email: data.user.email ?? "",
      },
      message: "user logged in successfully",
    };
  }
  async signOut(): Promise<{ error: boolean }> {
    const { error } = await this.supabase.auth.signOut();
    if(error){
      return {error:true}
    }
    return {
      error:true
    };
  }
  async getUsers(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if(error){
      return null;
    }
    return data.user;
  }
}
