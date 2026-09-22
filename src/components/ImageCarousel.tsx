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
    }, 4000);
  }, [clearTimer, handleNext]);

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

  const handleControlClick = () => {
    clearTimer();
    startTimer();
  };

  const currentImage = images[currentIndex];

  return (
    <div className="carousel" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="carousel__viewport">
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
          handleControlClick();
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
          handleControlClick();
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
              handleControlClick();
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