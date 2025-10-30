import { cn } from '@dz-web/esboot-browser';
import { isTrue } from '@dz-web/o-orange';
import Big from 'big.js';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

const actionCls = `h-[60px] w-[60px] bg-[var(--quote-tips-background-color)] rounded-[4px] flex
  flex-col items-center justify-center`;
const actionIconCls = `font-regular-40 leading-[0.6] mt-[6px]`;
const stepCls = `font-regular-16 text-secondary-color mt-[6px] text-ellipsis`;

interface NumberInputProps {
  step?: number;
  value: string | number;
  showStep?: boolean;
  onChange?: (value: number) => void;
  placeholder?: string;
  max?: number;
  min?: number;
  showZero?: boolean;
  showRangeHint?: boolean;
}

const NumberInput = (props: NumberInputProps) => {
  const {
    step = 0,
    value,
    onChange,
    showStep = true,
    placeholder,
    max,
    min,
    showRangeHint = false,
    showZero = false,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [showHint, setShowHint] = useState(false);

  const { shouldShowHint, rangeText } = useMemo(() => {
    const shouldShowHintResult = showRangeHint && (max !== undefined || min !== undefined);

    let rangeTextResult = '';
    if (min !== undefined && max !== undefined) {
      rangeTextResult = `${min}~${max}`;
    } else if (min !== undefined) {
      rangeTextResult = `≥${min}`;
    } else if (max !== undefined) {
      rangeTextResult = `≤${max}`;
    }

    return { shouldShowHint: shouldShowHintResult, rangeText: rangeTextResult };
  }, [showRangeHint, max, min]);

  const add = () => {
    if (!isTrue(value) || !step) return;
    const newValue = new Big(value).plus(step).toNumber();
    const finalValue = Math.max(newValue, step);

    if (max !== undefined) {
      onChange?.(Math.min(finalValue, max));
    } else {
      onChange?.(finalValue);
    }
  };

  const minus = () => {
    if (!isTrue(value) || !step) return;
    const newValue = new Big(value).minus(step).toNumber();
    const finalValue = Math.max(newValue, 0);

    if (min !== undefined) {
      onChange?.(Math.max(finalValue, min));
    } else {
      onChange?.(finalValue);
    }
  };

  const blur = () => {
    if (!inputRef.current) return;
    const inputValue = Number(inputRef.current.value);
    const finalValue = Math.max(inputValue, min || 0);

    if (max !== undefined) {
      const clampedValue = Math.min(finalValue, max);
      inputRef.current.value = String(clampedValue);
      onChange?.(clampedValue);
    } else {
      inputRef.current.value = String(finalValue);
      onChange?.(finalValue);
    }

    setShowHint(false);
  };

  const focus = () => {
    if (!shouldShowHint) return;
    setShowHint(true);
  };

  useEffect(() => {
    if (!inputRef.current) return;
    const _value = !showZero ? value || '' : value;
    inputRef.current.value = String(_value);
  }, [value, showZero]);

  return (
    <div className="relative">
      <div className="flex items-center">
        <div className={actionCls} onClick={minus}>
          <span className={cn(actionIconCls, !showStep && 'mt-[-4px] leading-[1]')}>—</span>
          {showStep && <div className={stepCls}>{step}</div>}
        </div>
        <div className="flex flex-1 items-center overflow-x-hidden px-[20px]">
          <input
            ref={inputRef}
            type="number"
            className="font-regular-30 min-w-0 flex-1 text-center outline-none"
            onBlur={blur}
            onFocus={focus}
            placeholder={placeholder}
            max={max}
            min={min}
          />
        </div>
        <div className={actionCls} onClick={add}>
          <span className={cn(actionIconCls, !showStep && 'mt-[-4px] leading-[1]')}>+</span>
          {showStep && <div className={stepCls}>{step}</div>}
        </div>
      </div>

      {shouldShowHint && showHint && (
        <div className="absolute bottom-full left-1/2 z-10 -translate-x-1/2 transform">
          <div
            className="whitespace-nowrap rounded-[8px] bg-white px-[18px] py-[12px] text-[32px] text-[#BB874A]
              shadow-lg"
          >
            {rangeText}
            <div
              className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4
                border-transparent border-t-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(NumberInput);
