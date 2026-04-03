"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";

const toTimestamp = (value?: string | Date | number) => {
  if (value === undefined || value === null) return null;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

const clampTime = (target: number) => Math.max(target - Date.now(), 0);

const useCountdownState = (targetTime?: string | Date | number) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const target = toTimestamp(targetTime);
    return target !== null ? clampTime(target) : 0;
  });

  useEffect(() => {
    const target = toTimestamp(targetTime);
    if (target === null) {
      setTimeLeft(0);
      return;
    }

    const update = () => {
      setTimeLeft(clampTime(target));
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

export interface CountdownRenderProps {
  timeLeft: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
}

interface CountdownTimerProps {
  targetTime?: string | Date | number;
  onTick?: (state: CountdownRenderProps) => void;
  onFinish?: () => void;
  children?: (state: CountdownRenderProps) => ReactNode;
}

const CountdownTimer = ({
  targetTime,
  onTick,
  onFinish,
  children,
}: CountdownTimerProps) => {
  const countdown = useCountdownState(targetTime);
  const finishNotifiedRef = useRef(false);

  useEffect(() => {
    if (countdown.isFinished) {
      if (!finishNotifiedRef.current) {
        finishNotifiedRef.current = true;
        onFinish?.();
      }
    } else {
      finishNotifiedRef.current = false;
    }
  }, [countdown.isFinished, onFinish]);

  useEffect(() => {
    onTick?.(countdown);
  }, [countdown, onTick]);

  if (!children) return null;

  return <>{children(countdown)}</>;
};

export default CountdownTimer;
