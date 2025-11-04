

// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { motion, AnimatePresence, Variants } from "framer-motion";
// import { cn } from "@/lib/utils";

// type ImagesSliderProps = {
//   images: string[];
//   children?: React.ReactNode;
//   overlay?: boolean;
//   overlayClassName?: string;
//   className?: string;
//   autoplay?: boolean;
//   direction?: "up" | "down";
// };

// export const ImagesSlider: React.FC<ImagesSliderProps> = ({
//   images,
//   children,
//   overlay = true,
//   overlayClassName,
//   className,
//   autoplay = true,
//   direction = "up",
// }) => {
//   const [currentIndex, setCurrentIndex] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [loadedImages, setLoadedImages] = useState<string[]>([]);

//   const intervalRef = useRef<number | null>(null);

//   const handleNext = () =>
//     setCurrentIndex((prevIndex) => (prevIndex + 1 === images.length ? 0 : prevIndex + 1));

//   const handlePrevious = () =>
//     setCurrentIndex((prevIndex) => (prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1));

//   // ---- Declare loadImages BEFORE useEffect ----
//   const loadImages = () => {
//     setLoading(true);
//     const loadPromises = images.map((src) => {
//       return new Promise<string>((resolve, reject) => {
//         const img = new Image();
//         img.src = src;
//         img.onload = () => resolve(src);
//         img.onerror = () => reject(new Error(`Failed to load image ${src}`));
//       });
//     });

//     Promise.all(loadPromises)
//       .then((imgs) => {
//         setLoadedImages(imgs);
//         setLoading(false);
//       })
//       .catch((error) => {
//         // keep loading false on error to avoid infinite spinner
//         console.error("Failed to load images", error);
//         setLoadedImages([]);
//         setLoading(false);
//       });
//   };

//   // load images on mount and whenever images prop changes
//   useEffect(() => {
//     loadImages();
//     // reset index if images length changes and currentIndex out of bounds
//     if (currentIndex >= images.length) setCurrentIndex(0);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [images]);

//   // keyboard nav + autoplay
//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === "ArrowRight") handleNext();
//       else if (event.key === "ArrowLeft") handlePrevious();
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     // autoplay (use window.setInterval so return type is number)
//     if (autoplay && images.length > 1) {
//       // clear existing just in case
//       if (intervalRef.current) {
//         window.clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//       intervalRef.current = window.setInterval(() => {
//         handleNext();
//       }, 5000);
//     }

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       if (intervalRef.current) {
//         window.clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//     };
//     // include autoplay and images.length in deps so autoplay restarts correctly
//   }, [autoplay, images.length]); // handleNext/Previous are stable because they're simple inline fns

//   const slideVariants: Variants = {
//     initial: { scale: 0, opacity: 0, rotateX: 45 },
//     visible: {
//       scale: 1,
//       rotateX: 0,
//       opacity: 1,
//       transition: { duration: 0.5, ease: "easeInOut" }, // typed-safe easing
//     },
//     upExit: { opacity: 0, y: "-150%", transition: { duration: 1 } },
//     downExit: { opacity: 0, y: "150%", transition: { duration: 1 } },
//   };

//   const areImagesLoaded = loadedImages.length > 0;

//   return (
//     <div
//       className={cn("overflow-hidden h-full w-full relative flex items-center justify-center", className)}
//       style={{ perspective: "1000px" }}
//     >
//       {/* maybe show placeholder / spinner while loading */}
//       {!areImagesLoaded && loading && (
//         <div className="absolute inset-0 flex items-center justify-center z-30">
//           <span className="text-white">Loading…</span>
//         </div>
//       )}

//       {/* overlay & children (only when images ready) */}
//       {areImagesLoaded && children}
//       {areImagesLoaded && overlay && <div className={cn("absolute inset-0 bg-black/60 z-40", overlayClassName)} />}

//       {/* image display */}
//       {areImagesLoaded && (
//         <AnimatePresence initial={false} mode="wait">
//           <motion.img
//             key={currentIndex}
//             src={loadedImages[currentIndex]}
//             initial="initial"
//             animate="visible"
//             exit={direction === "up" ? "upExit" : "downExit"}
//             variants={slideVariants}
//             className="image h-full w-full absolute inset-0 object-cover object-center"
//             alt={`slide-${currentIndex}`}
//             draggable={false}
//           />
//         </AnimatePresence>
//       )}
//     </div>
//   );
// };

// export default ImagesSlider;


"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  className?: string;
  autoplay?: boolean;
  direction?: "up" | "down";
  overlay?: boolean;
  overlayClassName?: string;
  children?: React.ReactNode;
  placeholder?: string; // optional placeholder URL
  retry?: boolean; // whether to retry a failed image once
};

const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'%3E%3Crect width='100%25' height='100%25' fill='%23000'/%3E%3Ctext x='50%25' y='50%25' fill='%23fff' font-size='24' font-family='Arial' text-anchor='middle' dominant-baseline='middle'%3EImage unavailable%3C/text%3E%3C/svg%3E";

export const ImagesSlider: React.FC<Props> = ({
  images,
  className,
  autoplay = true,
  direction = "up",
  overlay = true,
  overlayClassName,
  children,
  placeholder = DEFAULT_PLACEHOLDER,
  retry = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const loadOne = (src: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
      img.onerror = () => reject(new Error(`Failed to load image ${src}`));
    });

  // load images resiliently: try all, keep successes; optionally retry failed ones once
  const loadImages = async () => {
    setLoading(true);
    if (!images || images.length === 0) {
      setLoadedImages([]);
      setLoading(false);
      return;
    }

    // try all first time
    const settled = await Promise.allSettled(images.map((src) => loadOne(src)));
    const success: string[] = [];
    const failed: string[] = [];

    settled.forEach((r, i) => {
      if (r.status === "fulfilled") success.push(r.value);
      else failed.push(images[i]);
    });

    // optional single retry for failed URLs (useful for transient network or rate limits)
    if (retry && failed.length > 0) {
      const retrySettled = await Promise.allSettled(failed.map((s) => loadOne(s)));
      retrySettled.forEach((r, i) => {
        if (r.status === "fulfilled") success.push(r.value);
        else console.warn("ImagesSlider: image failed after retry:", failed[i]);
      });
    }

    if (success.length === 0) {
      // nothing loaded — fall back to placeholder
      console.warn("ImagesSlider: no images loaded, using placeholder.");
      setLoadedImages([placeholder]);
    } else {
      setLoadedImages(success);
    }

    setLoading(false);
    setCurrentIndex(0);
  };

  useEffect(() => {
    loadImages();
    // reset index if prop images array changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  useEffect(() => {
    if (!autoplay || loadedImages.length <= 1) return;
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => setCurrentIndex((p) => (p + 1) % loadedImages.length), 5000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [autoplay, loadedImages.length]);

  const slideVariants: Variants = {
    initial: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: direction === "up" ? "-100%" : "100%", transition: { duration: 0.8 } },
  };

  const areImagesLoaded = loadedImages.length > 0;

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {overlay && <div className={cn("absolute inset-0 bg-black/50 z-10", overlayClassName)} />}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 text-white">
          Loading…
        </div>
      )}

      <AnimatePresence initial={false} mode="wait">
        {areImagesLoaded && (
          <motion.img
            key={currentIndex}
            src={loadedImages[currentIndex]}
            alt={`slide-${currentIndex + 1}`}
            initial="initial"
            animate="visible"
            exit="exit"
            variants={slideVariants}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            onError={(e) => {
              // defensive: remove the failed image from the list and advance index
              console.warn("ImagesSlider: runtime image error, removing slide", e);
              setLoadedImages((prev) => {
                const next = prev.filter((_, idx) => idx !== currentIndex);
                // if nothing left use placeholder
                return next.length === 0 ? [placeholder] : next;
              });
              setCurrentIndex((prev) => (prev >= loadedImages.length - 1 ? 0 : prev));
            }}
          />
        )}
      </AnimatePresence>

      {children}
    </div>
  );
};

export default ImagesSlider;
