'use client'

import { SupabaseService } from "../supabase/SupabaseService";

const supabase = SupabaseService.browser();

export async function unsubscribeFromPush(userId: string) {
    console.log(unsubscribeFromPush)
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;

  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  await subscription.unsubscribe();

   const res = await supabase.from("push_subscriptions").delete().eq("user_id", userId);
   console.log(res)
        if (res.error) {
            console.log("Error removing subscription from database:", res.error);
        }else {
        console.log("Failed to unsubscribe from push notifications.");
    }
}