"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  coverImage: string;
  galleryImages: string[];
  name: string;
}

export function ImageGallery({ coverImage, galleryImages, name }: ImageGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const allImages = [coverImage, ...(galleryImages || [])];
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const childWidth = container.clientWidth;
    container.scrollTo({ left: childWidth * index, behavior: "smooth" });
    setCurrentIndex(index);
  };

  const scrollLeft = () => {
    if (currentIndex > 0) scrollToIndex(currentIndex - 1);
  };

  const scrollRight = () => {
    if (currentIndex < allImages.length - 1) scrollToIndex(currentIndex + 1);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border-subtle group">
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {allImages.map((src, i) => (
          <div key={i} className="relative min-w-full h-full snap-center">
            <Image
              src={src}
              alt={`${name} image ${i + 1}`}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {allImages.length > 1 && (
        <>
          <button
            onClick={scrollLeft}
            disabled={currentIndex === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60 disabled:opacity-0 disabled:pointer-events-none md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={scrollRight}
            disabled={currentIndex === allImages.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60 disabled:opacity-0 disabled:pointer-events-none md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 pointer-events-none">
            {allImages.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 rounded-full bg-white transition-all",
                  i === currentIndex ? "w-5 opacity-100" : "w-1.5 opacity-40"
                )}
              />
            ))}
          </div>
          
          {/* Swipe Hint (mobile only) */}
          <div className="absolute top-4 right-4 rounded-full bg-black/40 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur-md flex items-center gap-1.5 pointer-events-none md:hidden">
            Geser <ArrowLeft className="rotate-180" size={10} />
          </div>
        </>
      )}
    </div>
  );
}
