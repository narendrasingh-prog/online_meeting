import PreviousMeeting from "@/components/Home/Previous-meeting";
import { Suspense } from "react";
import LoadingPrevious from "./loading";


const Previous = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white no-scrollbar overflow-y-auto">
      <h1 className="text-extrobold text-3xl ">Previous Meeting</h1>
      <Suspense fallback={<LoadingPrevious/>}>
      <PreviousMeeting />
      </Suspense>
    </section>
  );
};

export default Previous;
