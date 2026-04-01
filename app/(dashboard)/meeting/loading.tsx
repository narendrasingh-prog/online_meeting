import React from "react";

const chatBubbles = Array.from({ length: 5 });
const participants = Array.from({ length: 5 });

const MeetingLoading = () => {
  return (
    <div className="max-w-6xl mx-auto animate-pulse p-6 space-y-6">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/90 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="h-6 w-60 rounded-full bg-slate-800" />
          <div className="h-6 w-36 rounded-full bg-slate-800/70" />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="h-8 w-20 rounded-full bg-slate-800/80" />
          <span className="h-8 w-20 rounded-full bg-slate-800/80" />
          <span className="h-8 w-20 rounded-full bg-slate-800/80" />
        </div>
      </div>

      <section className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:min-w-[280px] space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-lg shadow-black/40">
          <div className="h-10 w-full rounded-full bg-slate-800" />
          <div className="space-y-3 pt-2">
            {participants.map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/80 px-3 py-2"
              >
                <span className="h-4 w-24 rounded-full bg-slate-800" />
                <span className="h-3 w-12 rounded-full bg-slate-800/70" />
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-3 text-xs text-slate-400">
            <span className="h-3 w-10 rounded-full bg-slate-800/70" />
            <span className="h-3 w-10 rounded-full bg-slate-800/70" />
          </div>
        </div>

        <div className="flex-1 space-y-5">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-lg shadow-black/25">
            <div className="space-y-3">
              <div className="h-4 w-32 rounded-full bg-slate-800" />
              <div className="h-6 w-48 rounded-full bg-slate-800/70" />
              <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
                <div className="space-y-2">
                  <span className="h-3 w-20 rounded-full bg-slate-800" />
                  <span className="h-3 w-28 rounded-full bg-slate-800/80" />
                </div>
                <div className="space-y-2">
                  <span className="h-3 w-20 rounded-full bg-slate-800" />
                  <span className="h-3 w-28 rounded-full bg-slate-800/80" />
                </div>
                <div className="space-y-2">
                  <span className="h-3 w-20 rounded-full bg-slate-800" />
                  <span className="h-3 w-28 rounded-full bg-slate-800/80" />
                </div>
                <div className="space-y-2">
                  <span className="h-3 w-20 rounded-full bg-slate-800" />
                  <span className="h-3 w-28 rounded-full bg-slate-800/80" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-lg shadow-black/25">
            <div className="space-y-4">
              {chatBubbles.map((_, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="h-4 w-32 rounded-full bg-slate-800/80" />
                  <div className="h-3 w-full rounded-full bg-slate-800" />
                  <div className="h-3 w-4/5 rounded-full bg-slate-800" />
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 rounded-full bg-slate-800" />
                <div className="h-10 rounded-full bg-slate-800/80" />
              </div>
              <div className="h-10 w-28 rounded-full bg-slate-800/70" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MeetingLoading;
