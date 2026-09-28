"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

export function CountUp({
  value,
  suffix = "",
  duration = 1.6,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  // Start on the real value so the number is always correct even if the
  // in-view animation never fires (e.g. a flaky IntersectionObserver on mobile).
  const [n, setN] = useState(value);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    setN(0);
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min((t - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(p < 1 ? Math.round(eased * value) : value);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}
