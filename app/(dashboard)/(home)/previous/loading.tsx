const skeletonRows = Array.from({ length: 6 });

const LoadingPrevious = () => {
  return (
    <section className="animate-pulse flex size-full flex-col gap-8 text-white">
     

      <div className="no-scrollbar overflow-y-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {skeletonRows.map((_, index) => (
            <div
              key={index}
              className="flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-5 shadow-lg shadow-black/30"
            >
              <div className="h-5 w-1/2 rounded-full bg-slate-800/80" />
              <div className="h-3 w-3/4 rounded-full bg-slate-800/70" />
              <div className="h-3 w-1/2 rounded-full bg-slate-800/70" />
              <div className="h-2 w-full rounded-full bg-slate-800/60" />
              <div className="flex items-center gap-3">
                <div className="h-8 w-24 rounded-full bg-slate-800/60" />
                <div className="h-8 w-12 rounded-full bg-slate-800/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoadingPrevious;
