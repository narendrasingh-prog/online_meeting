import React from "react";

const skeletonCards = Array.from({ length: 3 });
const skeletonLiveItems = Array.from({ length: 4 });

const LoadingPage = () => {
  return (
    <section className="animate-pulse flex flex-col gap-10 text-white">
      <div className="rounded-[20px] bg-slate-800/60 shadow-lg shadow-black/20">
        <div className="flex h-[300px] w-full flex-col justify-between gap-6 rounded-[20px] bg-gradient-to-br from-slate-900/80 via-slate-700/80 to-slate-900/80 p-8">
          <div className="flex flex-col gap-3">
            <span className="h-5 w-28 rounded-full bg-white/20" />
            <span className="h-4 w-40 rounded-full bg-white/10" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="h-10 w-32 rounded-lg bg-white/10" />
            <span className="h-6 w-64 rounded-lg bg-white/10" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="h-4 w-24 rounded-full bg-white/10" />
            <span className="h-4 w-20 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skeletonCards.map((_, index) => (
          <div
            key={index}
            className="flex h-[260px] flex-col justify-between rounded-[14px] bg-slate-900/60 px-5 py-6 shadow-xl shadow-black/40"
          >
            <div className="h-12 w-12 rounded-[12px] bg-slate-700/80" />
            <div className="space-y-3">
              <span className="mt-2 block h-6 w-3/4 rounded-full bg-white/10" />
              <span className="block h-4 w-5/6 rounded-full bg-white/10" />
            </div>
            <div className="h-10 w-full rounded-full bg-white/10" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        <div className="h-12 w-48 rounded-full bg-slate-700/80" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skeletonLiveItems.map((_, index) => (
            <div
              key={index}
              className="space-y-3 rounded-[12px] border border-white/10 bg-slate-900/40 p-4"
            >
              <span className="block h-5 w-3/4 rounded-full bg-white/10" />
              <span className="block h-4 w-1/2 rounded-full bg-white/5" />
              <span className="block h-4 w-2/3 rounded-full bg-white/5" />
              <div className="flex items-center gap-2">
                <span className="h-8 w-20 rounded-full bg-blue-500/40" />
                <span className="h-8 w-12 rounded-full bg-blue-500/30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoadingPage;
