/* eslint-disable react-hooks/exhaustive-deps */
import useWillUnmount from "@restart/hooks/useWillUnmount";
import { DependencyList, EffectCallback, useMemo, useRef } from "react";

/**
 * This behaves identically to @restart's useImmediateUpdateEffect, but will
 * also call its callback upon creation.
 */
export default function useImmediateUpdateEffect(effect: EffectCallback, deps: DependencyList) {
  const tearDown = useRef<ReturnType<EffectCallback>>();

  useWillUnmount(() => {
    if (tearDown.current) tearDown.current();
  });

  useMemo(() => {
    if (tearDown.current) tearDown.current();
    const effectResult = effect();
    tearDown.current = effectResult instanceof Function ? effectResult : undefined;
  }, deps);
}
