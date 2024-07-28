import React, { useState, useEffect } from 'react';
import '../App.css';

const TextAnimation = ({ text }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const animationTimeout = setTimeout(() => {
      setIsAnimating(false);
    }, 2000); // Adjust the duration as needed

    return () => {
      clearTimeout(animationTimeout);
    };
  }, []);

  return (
    <div class="container">

      <div class="row">
        <div class="col-md-12 text-center">
          <h3 class="animate-charcter"> david</h3>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 text-center">
          <h3 class="animate-charcter"> david</h3>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 text-center">
          <h3 class="animate-charcter"> david</h3>
        </div>
      </div>
    </div>
  );
};

export default TextAnimation;
