"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

export type StackPhoto = { src: string; alt: string };

/**
 * A draggable photo stack: the top card tilts and spins away toward the side
 * you swipe, while the next photo rises up from behind the deck. Falls back to
 * a plain cross-fade when the viewer prefers reduced motion.
 */
export function HeroStack({
  photos,
  caption,
  className = "",
  sizes = "(min-width: 768px) 45vw, 100vw",
}: {
  photos: StackPhoto[];
  caption?: string;
  className?: string;
  sizes?: string;
}) {
  const reduce = useReducedMotion();
  // `index` grows without bound; the actual photo is index mod length.
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const n = photos.length;
  const at = (i: number) => photos[((i % n) + n) % n];
  const active = ((index % n) + n) % n;

  const go = (d: number) => setState([index + d, d]);

  const SWIPE = 55;

  const variants = {
    // new card rises from behind the deck…
    enter: { scale: 0.96, y: 12, opacity: 0, zIndex: 1 },
    center: { scale: 1, x: 0, y: 0, rotate: 0, opacity: 1, zIndex: 1 },
    // …while the outgoing card stays on top (zIndex 2) and spins away to the
    // side you swiped.
    exit: (d: number) => ({
      x: d > 0 ? -340 : 340,
      y: 140,
      rotate: d > 0 ? -16 : 16,
      opacity: 0,
      zIndex: 2,
    }),
  };

  return (
    <div className={className}>
      <div className="relative aspect-[4/5] w-full select-none">
        {/* deck — static cards peeking out behind the top photo */}
        <div
          aria-hidden
          className="absolute inset-0 translate-y-5 scale-[0.93] rounded-2xl bg-sand shadow-[0_20px_50px_-34px_rgba(20,39,27,0.5)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 translate-y-2.5 scale-[0.965] overflow-hidden rounded-2xl shadow-[0_24px_60px_-36px_rgba(20,39,27,0.5)]"
        >
          <Image src={at(index + 1).src} alt="" fill sizes={sizes} className="object-cover" />
        </div>

        {/* top card */}
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            variants={reduce ? undefined : variants}
            initial={reduce ? { opacity: 0 } : "enter"}
            animate={reduce ? { opacity: 1 } : "center"}
            exit={reduce ? { opacity: 0 } : "exit"}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            whileDrag={{ scale: 1.02, cursor: "grabbing" }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE) go(1);
              else if (info.offset.x > SWIPE) go(-1);
            }}
            className="absolute inset-0 touch-pan-y overflow-hidden rounded-2xl shadow-[0_30px_80px_-40px_rgba(20,39,27,0.55)] md:cursor-grab"
          >
            <Image
              src={at(index).src}
              alt={at(index).alt}
              fill
              priority={index === 0}
              sizes={sizes}
              draggable={false}
              className="pointer-events-none object-cover"
            />
            {caption && (
              <span className="mono absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest/70 to-transparent px-4 pb-4 pt-12 text-[11px] uppercase tracking-wide text-oat">
                {caption}
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5" aria-hidden>
          {photos.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                active === i ? "w-5 bg-green" : "w-1.5 bg-stone/25"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone/25 text-green transition-colors hover:bg-green/5"
          >
            <span aria-hidden>←</span>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone/25 text-green transition-colors hover:bg-green/5"
          >
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
