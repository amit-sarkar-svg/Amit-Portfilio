import { useEffect } from 'react';

const ImagePreloader = () => {
  useEffect(() => {
    // Preload critical images
    const criticalImages = [
      '/assets/sky.jpg',
      '/assets/mountain-1.png',
      '/assets/mountain-2.png',
      '/assets/mountain-3.png',
      '/assets/planets.png',
      '/assets/coding-pov.png'
    ];

    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return null;
};

export default ImagePreloader;
