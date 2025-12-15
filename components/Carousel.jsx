import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Carousel.css';

// Imagens Desktop
import img1 from '../assets/fundosite.png';
import img2 from '../assets/carrossel2.png';
import img3 from '../assets/carrossel3.png';
import img4 from '../assets/carrossel4.png';

// Imagens Mobile
import mobile1 from '../assets/slidemobile1.png';
import mobile2 from '../assets/slidemobile2.png';
import mobile3 from '../assets/slidemobile3.png';
import mobile4 from '../assets/slidemobile4.png';
import mobile5 from '../assets/slidemobile5.png';

export function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Array de imagens dependendo do dispositivo
  const slideImages = isMobile
    ? [mobile1, mobile2,mobile4,mobile5]
    : [img1, img2, img3, img4];


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Funções de navegação
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slideImages.length - 1 : prevIndex - 1
    );
  }, [slideImages.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slideImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [slideImages.length]);

  // Timer
  useEffect(() => {
    const interval = setInterval(goToNext, 3000);
    return () => clearInterval(interval);
  }, [goToNext]);

  // Swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchEndX.current === 0) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      goToNext();
    } else if (distance < -minSwipeDistance) {
      goToPrevious();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div
      className="carousel-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button onClick={goToPrevious} className="carousel-button prev">
        &#10094;
      </button>

      <div className="slides-wrapper">
        <div
          className="slides-inner"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slideImages.map((imageSrc, index) => (
            <div
              key={index}
              className="carousel-slide"
              style={{ backgroundImage: `url(${imageSrc})` }}
            ></div>
          ))}
        </div>
      </div>

      <button onClick={goToNext} className="carousel-button next">
        &#10095;
      </button>
    </div>
  );
}
