import { useEffect, useRef } from "react";

export default function useAnimationFrame(
  callback: (elapsedMs: number) => void,
  active: boolean
): void {
  const cb = useRef<(elapsedMs: number) => void>();

  // TODO(shyndman): This feels wrong
  useEffect(() => {
    cb.current = callback;
  }, [callback]);

  useEffect(() => {
    let lastTickMs: number;
    const updateLastTick = () => {
      lastTickMs = lastTickMs || Date.now();
      return Date.now() - lastTickMs;
    };

    let requestId: number;
    const requestFrame = () => (requestId = requestAnimationFrame(tick));

    const tick = () => {
      requestFrame();
      cb.current && cb.current(updateLastTick());
    };

    if (active) {
      updateLastTick();
      requestFrame();
      return () => cancelAnimationFrame(requestId);
    }
  }, [active]);
}
