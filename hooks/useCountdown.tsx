import { useEffect, useState } from "react";

export const useCountdown = (targetTime?: string | Date) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!targetTime) return;

    const target = new Date(targetTime).getTime();

    const update = () => {
      const now = Date.now();
      const diff = Math.max(target - now, 0);
      setTimeLeft(diff);
    };

    update(); 

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return {
    timeLeft,
    hours,
    minutes,
    seconds,
    isFinished: timeLeft <= 0,
  };
};