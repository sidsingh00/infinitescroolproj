import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ImageGallery.css';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.unsplash.com/photos?page=${page}&client_id=ax6Po4s9HsWB398U0GyoUnMTHoL9Ek-V7PppaR8E304`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setImages((prevImages) => [...prevImages, ...data]);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prevPage) => prevPage + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <div className="image-container" key={index}>
          <img src={image.urls.small} alt={image.alt_description} loading="lazy" />
        </div>
      ))}
      {loading && <div className="loading">Loading more images...</div>}
      <div ref={loader} />
    </div>
  );
};

export default ImageGallery;
