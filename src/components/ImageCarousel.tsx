import { useState, useEffect, useRef, useCallback } from 'react';
import type { CarouselImage } from '../data/images';
import './ImageCarousel.css';

interface ImageCarouselProps {
  images: CarouselImage[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number | null>(null);
  const startTimerRef = useRef<() => void>(() => {});

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleDotClick = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      handleNext();
      startTimerRef.current();
    }, 4000);
  }, [clearTimer, handleNext]);

  startTimerRef.current = startTimer;

  const resetTimer = useCallback(() => {
    clearTimer();
    startTimer();
  }, [clearTimer, startTimer]);

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, [startTimer, clearTimer]);

  useEffect(() => {
    if (isHovered) {
      clearTimer();
    } else {
      startTimer();
    }
  }, [isHovered, startTimer, clearTimer]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
        resetTimer();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
        resetTimer();
      }
    },
    [handlePrevious, handleNext, resetTimer]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button')) return;
      touchStartRef.current = e.clientX;
      touchStartTimeRef.current = Date.now();
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (touchStartRef.current === null) return;

      const deltaX = e.clientX - touchStartRef.current;
      const startY = Number((e.currentTarget as HTMLElement).dataset.touchStartY || '0');
      const deltaY = e.clientY - startY;

      if (Math.abs(deltaX) < 10 && touchStartTimeRef.current !== null) {
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return;
        }
      }
    },
    []
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (touchStartRef.current === null) return;

      const deltaX = e.clientX - touchStartRef.current;
      const deltaTime = Date.now() - (touchStartTimeRef.current || 0);
      const threshold = 50;

      if (Math.abs(deltaX) >= threshold && deltaTime < 500) {
        if (deltaX < 0) {
          handleNext();
        } else {
          handlePrevious();
        }
        resetTimer();
      }

      touchStartRef.current = null;
      touchStartTimeRef.current = null;
      e.currentTarget.releasePointerCapture(e.pointerId);
    },
    [handlePrevious, handleNext, resetTimer]
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent) => {
      touchStartRef.current = null;
      touchStartTimeRef.current = null;
      e.currentTarget.releasePointerCapture(e.pointerId);
    },
    []
  );

  const currentImage = images[currentIndex];

  return (
    <div
      className="carousel"
      tabIndex={0}
      role="region"
      aria-label="Image carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      <div className="carousel__viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerDownCapture={(e) => {
          (e.currentTarget as HTMLElement).dataset.touchStartY = e.clientY.toString();
        }}
      >
        <div
          className="carousel__track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image) => (
            <div key={image.id} className="carousel__slide">
              <img
                src={image.src}
                alt={image.alt}
                className="carousel__image"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="carousel__button carousel__button--prev"
        onClick={() => {
          handlePrevious();
          resetTimer();
        }}
        aria-label="Previous slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        type="button"
        className="carousel__button carousel__button--next"
        onClick={() => {
          handleNext();
          resetTimer();
        }}
        aria-label="Next slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div className="carousel__dots" role="tablist" aria-label="Slide indicators">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`carousel__dot ${index === currentIndex ? 'carousel__dot--active' : ''}`}
            onClick={() => {
              handleDotClick(index);
              resetTimer();
            }}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="carousel__title">{currentImage.title}</div>
    </div>
  );
}