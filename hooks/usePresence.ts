import { useEffect } from "react";

export type PresencePayload = {
  key: string;
  presence_ref: string;
  user_id: string;
  [key: string]: any;
};

export type PresenceJoinEvent = {
  newPresences: PresencePayload[];
};

export type PresenceLeaveEvent = {
  leftPresences: PresencePayload[];
};

export function usePresence(
  channelRef: React.MutableRefObject<any>,
  userId: string,
  onSomeoneLeft: (userId: string) => void
) {
  useEffect(() => {
    const channel = channelRef.current;
    if (!channel) return;

    channel
      .on("presence", { event: "join" }, ({ newPresences }: PresenceJoinEvent) => {
        console.log("Presence join:", newPresences);
      })
      .on("presence", { event: "leave" }, ({ leftPresences }: PresenceLeaveEvent) => {
        if (!leftPresences.length) return;
        const myId = String(userId);
  const didILeave = leftPresences.some(
    (p: any) => String(p.user_id) === myId
  );
  if (didILeave) onSomeoneLeft(myId);
        // const leftUserId = leftPresences[0].user_id;
        // onSomeoneLeft(leftUserId);
      })
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: userId,
            joined_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.untrack();
    
    };
  }, [userId, channelRef, onSomeoneLeft]);
}