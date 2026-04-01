import React from "react";

const UserLoading = () => {
  return (
    <div className="mx-auto max-w-lg space-y-6 rounded-lg border border-white/[0.08] bg-slate-950/70 p-6 shadow-xl shadow-black/40 animate-pulse">
      <div className="text-center space-y-3">
        <div className="mx-auto h-24 w-24 rounded-full bg-slate-800" />
        <div className="mx-auto h-3 w-32 rounded-full bg-slate-800/80" />
        <p className="text-xs text-slate-500">Loading profile preview…</p>
      </div>

      <div className="space-y-2">
        <span className="block h-4 w-24 rounded-full bg-slate-800" />
        <div className="h-10 w-full rounded-md bg-slate-800/80" />
      </div>

      <div className="space-y-2">
        <span className="block h-4 w-28 rounded-full bg-slate-800" />
        <div className="h-10 w-full rounded-md bg-slate-800/80" />
      </div>

      <div className="space-y-2">
        <span className="block h-3 w-48 rounded-full bg-slate-800/50" />
        <div className="h-10 w-full rounded-md bg-slate-800/80" />
      </div>

      <div className="space-y-2">
        <span className="block h-4 w-32 rounded-full bg-slate-800/60" />
        <div className="h-10 w-full rounded-md bg-slate-800/80" />
      </div>

      <div className="h-12 w-full rounded-md bg-slate-800" />
    </div>
  );
};

export default UserLoading;
