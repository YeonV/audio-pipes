import { useKeyPress } from "hooks/useKeyPress";
import React from "react";

interface Props
  extends Omit<React.HTMLProps<HTMLInputElement>, "onChange" | "step" | "type" | "value"> {
  onChange: (value: number) => void;
  largeStep?: number;
  standardStep?: number;
  smallStep?: number;
  value: number;
}

const LARGE_STEP_MODIFIER_KEY = "Shift";
const SMALL_STEP_MODIFIER_KEY = "Alt";

function NumericStepper({
  onChange,
  value,
  largeStep = 10,
  standardStep = 1,
  smallStep = 0.1,
  ...props
}: Props) {
  const isLargeStep = useKeyPress(LARGE_STEP_MODIFIER_KEY);
  const isSmallStep = useKeyPress(SMALL_STEP_MODIFIER_KEY);
  const step = isLargeStep ? largeStep : isSmallStep ? smallStep : standardStep;

  function onKeyDown({ key }: React.KeyboardEvent<HTMLInputElement>) {
    if (key === "ArrowUp") {
      onChange(roundToFixed(value + step));
    } else if (key === "ArrowDown") {
      onChange(roundToFixed(value - step));
    }

    function roundToFixed(num: number) {
      return Math.round(num * 10) / 10;
    }
  }

  return (
    <input
      {...props}
      type="number"
      // Step is handled via JS, because Alt+DownArrow isn't picked up by the
      // input on Mac.
      step="0"
      onKeyDown={onKeyDown}
      onChange={event => onChange(+event.target.value)}
      value={value}
    />
  );
}

export default NumericStepper;
