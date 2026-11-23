"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  /** Optional callback fired when the preloader completely unmounts */
  onComplete?: () => void;
}

type Phase = "init" | "assemble" | "locked" | "exit" | "done";

/**
 * Luxury timing curves for premium brand particle motion
 */
const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;
const LUXURY_SMOOTH = [0.25, 0.1, 0.25, 1] as const;

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

interface ParticleTile {
  id: string;
  row: number;
  col: number;
  startX: number;
  startY: number;
  startRotate: number;
  delay: number;
}

const GRID_SIZE = 8;

/**
 * Deterministically generates the 52 mosaic particles originating from across
 * the FULL width and height of the screen (top, bottom, left, right, and corners).
 *
 * Distances range from 650px to 1100px so they sweep across the entire visible canvas.
 */
const TILES: ParticleTile[] = (() => {
  const list: ParticleTile[] = [];
  const half = GRID_SIZE / 2;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const dx = (c + 0.5) - half;
      const dy = (r + 0.5) - half;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Keep only particles that map to the circular medallion
      if (dist <= 4.05) {
        const angle = Math.atan2(dy, dx);
        // Wide-spread across the full screen boundaries (700px - 1100px)
        const seed = r * 23 + c * 41;
        const scatterDist = 720 + (seed % 420);
        let startX = Math.round(Math.cos(angle) * scatterDist);
        let startY = Math.round(Math.sin(angle) * scatterDist);

        // Add lateral dispersion so paths curve across the screen
        const lateral = ((r * 13 + c * 37) % 80) - 40;
        startX += Math.round(-Math.sin(angle) * lateral);
        startY += Math.round(Math.cos(angle) * lateral);

        const startRotate = Math.round(((r * 29 + c * 17) % 70) - 35);
        // Staggered arrival delays (0.04s - 0.45s)
        const delay = parseFloat((0.04 + ((r * 11 + c * 19) % 38) * 0.012).toFixed(3));

        list.push({
          id: `tile-${r}-${c}`,
          row: r,
          col: c,
          startX,
          startY,
          startRotate,
          delay,
        });
      }
    }
  }

  return list;
})();

/**
 * Pavan Vela Grand - Full-Screen Particle Assembly Preloader
 *
 * Sequence:
 * 1. Pure white full-screen canvas (#FFFFFF).
 * 2. Dozens of small, individual logo particles sweep inward from across the
 *    ENTIRE width and height of the screen (far top, bottom, left, right, and corners).
 * 3. The particles travel across the open white screen with smooth luxury easing and rotation.
 * 4. Each particle snaps with subpixel precision into its exact position in the central logo.
 * 5. As all particles converge, the complete, unclipped, solid circular logo locks together seamlessly.
 * 6. Stately pause with a subtle luxury settle.
 * 7. Smooth dissolve revealing the website, followed by clean unmounting.
 */
export function Preloader({ onComplete }: PreloaderProps) {
  const [phase, setPhase] = useState<Phase>("init");

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Prevent background scrolling while the preloader is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Orchestrate the full-screen particle assembly timeline
  useEffect(() => {
    if (prefersReducedMotion) {
      // Accessible sequence for users preferring reduced motion
      const t1 = setTimeout(() => setPhase("locked"), 100);
      const t2 = setTimeout(() => setPhase("exit"), 1600);
      const t3 = setTimeout(() => {
        setPhase("done");
        onComplete?.();
      }, 2300);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }

    // 0.10s: Particles begin their journey inward from all screen edges
    const tAssemble = setTimeout(() => setPhase("assemble"), 100);

    // 1.80s: All particles meet at the center and lock into the solid unified logo
    const tLocked = setTimeout(() => setPhase("locked"), 1800);

    // 3.20s: White veil dissolves smoothly to reveal the website
    const tExit = setTimeout(() => setPhase("exit"), 3200);

    // 3.95s: Cleanly unmount and unlock page
    const tDone = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, 3950);

    return () => {
      clearTimeout(tAssemble);
      clearTimeout(tLocked);
      clearTimeout(tExit);
      clearTimeout(tDone);
    };
  }, [prefersReducedMotion, onComplete]);

  if (phase === "done") {
    return null;
  }

  const isAssembled = phase === "assemble" || phase === "locked" || phase === "exit";
  const isLocked = phase === "locked" || phase === "exit";
  const isExiting = phase === "exit";

  return (
    <AnimatePresence mode="wait">
      {!isExiting && (
        <motion.div
          key="pvg-fullscreen-particle-preloader"
          role="status"
          aria-live="polite"
          aria-label="Pavan Vela Grand loading"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FFFFFF] select-none pointer-events-auto overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.75, ease: LUXURY_SMOOTH },
          }}
        >
          {/* Central Anchor for the Logo Assembly */}
          <motion.div
            className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80"
            initial={{ scale: 0.95 }}
            animate={{
              scale: isLocked ? 1 : 0.95,
            }}
            exit={{
              scale: 1.03,
              y: -8,
              opacity: 0,
              transition: { duration: 0.65, ease: LUXURY_SMOOTH },
            }}
            transition={{
              duration: 1.2,
              ease: LUXURY_EASE,
            }}
          >
            {/* 
              Particles fly freely from the entire screen without any clipping!
              Notice: No overflow-hidden on this container so particles remain visible
              all the way from the screen edges to the center.
            */}
            <div className="absolute inset-0" aria-hidden="true">
              {TILES.map((tile) => (
                <motion.div
                  key={tile.id}
                  className="absolute overflow-hidden rounded-[2px]"
                  style={{
                    left: `${(tile.col / GRID_SIZE) * 100}%`,
                    top: `${(tile.row / GRID_SIZE) * 100}%`,
                    width: `${100 / GRID_SIZE + 0.3}%`,
                    height: `${100 / GRID_SIZE + 0.3}%`,
                    willChange: "transform, opacity",
                  }}
                  initial={{
                    x: tile.startX,
                    y: tile.startY,
                    rotate: tile.startRotate,
                    scale: 0.35,
                    opacity: 0,
                  }}
                  animate={{
                    x: isAssembled ? 0 : tile.startX,
                    y: isAssembled ? 0 : tile.startY,
                    rotate: isAssembled ? 0 : tile.startRotate,
                    scale: isAssembled ? 1 : 0.35,
                    opacity: isAssembled ? 1 : 0,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0.3 : 1.35,
                    delay: prefersReducedMotion ? 0 : tile.delay,
                    ease: LUXURY_EASE,
                  }}
                >
                  {/* Inner Image mapped to exact subpixel slice */}
                  <div
                    className="relative pointer-events-none"
                    style={{
                      width: `${GRID_SIZE * 100}%`,
                      height: `${GRID_SIZE * 100}%`,
                      transform: `translate(${-tile.col * (100 / GRID_SIZE)}%, ${-tile.row * (100 / GRID_SIZE)}%)`,
                    }}
                  >
                    <Image
                      src="/images/pvg-logo.png"
                      alt=""
                      fill
                      priority
                      sizes="(max-width: 640px) 208px, (max-width: 768px) 256px, 320px"
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 
              Seamless Full Unified Logo with razor-sharp circular clip:
              Solidifies smoothly when all particles reach center, guaranteeing zero hairline gaps!
            */}
            <motion.div
              className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: isLocked ? 1 : 0,
              }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
            >
              <Image
                src="/images/pvg-logo.png"
                alt="Pavan Vela Grand Complete Logo"
                fill
                priority
                sizes="(max-width: 640px) 208px, (max-width: 768px) 256px, 320px"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Preloader;
