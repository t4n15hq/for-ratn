import React from 'react';

const FloralLoadingSpinner: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    width="60" 
    height="60" 
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg" 
    className="animate-floral-pulse" // Applies a tailwind pulse to the whole svg
    {...props}
  >
    {/* Petal 1 - Rotates */}
    <path d="M50 10 Q60 25 50 40 Q40 25 50 10 Z" fill="var(--color-primary-DEFAULT)" opacity="0.9">
      <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1.8s" repeatCount="indefinite" />
    </path>
    {/* Petal 2 - Rotates with delay */}
    <path d="M50 10 Q60 25 50 40 Q40 25 50 10 Z" fill="var(--color-primary-light)" opacity="0.8" transform="rotate(72 50 50)">
      <animateTransform attributeName="transform" type="rotate" from="72 50 50" to="432 50 50" dur="1.8s" begin="0.3s" repeatCount="indefinite" />
    </path>
    {/* Petal 3 - Rotates with more delay */}
    <path d="M50 10 Q60 25 50 40 Q40 25 50 10 Z" fill="var(--color-secondary-DEFAULT)" opacity="0.7" transform="rotate(144 50 50)">
      <animateTransform attributeName="transform" type="rotate" from="144 50 50" to="504 50 50" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
    </path>
     {/* Petal 4 - Rotates with more delay */}
    <path d="M50 10 Q60 25 50 40 Q40 25 50 10 Z" fill="var(--color-accent-DEFAULT)" opacity="0.6" transform="rotate(216 50 50)">
      <animateTransform attributeName="transform" type="rotate" from="216 50 50" to="576 50 50" dur="1.8s" begin="0.9s" repeatCount="indefinite" />
    </path>
    {/* Petal 5 - Rotates with most delay */}
    <path d="M50 10 Q60 25 50 40 Q40 25 50 10 Z" fill="var(--color-primary-dark)" opacity="0.5" transform="rotate(288 50 50)">
      <animateTransform attributeName="transform" type="rotate" from="288 50 50" to="648 50 50" dur="1.8s" begin="1.2s" repeatCount="indefinite" />
    </path>
    {/* Center - Pulsing size */}
    <circle cx="50" cy="50" r="12" fill="var(--color-card-DEFAULT)">
        <animate attributeName="r" values="10;14;10" dur="1.8s" repeatCount="indefinite" />
    </circle>
    <circle cx="50" cy="50" r="8" fill="var(--color-textBase)" />
  </svg>
);

export default FloralLoadingSpinner;