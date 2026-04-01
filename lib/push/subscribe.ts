'use client'

import { SupabaseService } from "../supabase/SupabaseService";
import { urlBase64ToUint8Array } from "./utils";

const supabase = SupabaseService.browser();
export async function subscribeToPush(userId: string) {
    
  const registration = await navigator.serviceWorker.register("/sw.js");

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
    )
  });
  console.log("subscribe")

  // Save subscription to Supabase or your own backend
   const res= await supabase.from("push_subscriptions").insert({
    user_id: userId,
    subscription
  })
  console.log(res)
  if(res.error){
    alert("Failed to save subscription")
    console.error("Error saving subscription:", res.error)
  }

  return subscription;
}