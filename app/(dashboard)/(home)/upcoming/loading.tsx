const skeletonCards = Array.from({ length: 4 });

const LoadingUpcoming = () => {
  return (
    <section className="animate-pulse flex size-full flex-col gap-10 text-white">
     

      <div className="no-scrollbar overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {skeletonCards.map((_, index) => (
            <div
              key={index}
              className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-lg shadow-black/40"
            >
              <div className="h-5 w-2/3 rounded-full bg-slate-800/80" />
              <div className="space-y-2">
                <div className="h-3 w-5/6 rounded-full bg-slate-800/70" />
                <div className="h-3 w-1/2 rounded-full bg-slate-800/60" />
              </div>
              <div className="space-y-1">
                <div className="h-3 w-4/5 rounded-full bg-slate-800/60" />
                <div className="h-3 w-3/4 rounded-full bg-slate-800/50" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-24 rounded-full bg-slate-800/70" />
                <div className="h-10 w-10 rounded-full bg-slate-800/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoadingUpcoming;
