import React from 'react';

const LeafAccentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-primary-DEFAULT/70" {...props}>
    {/* Main Leaf Shape */}
    <path 
      d="M10 2C6 4 4 7 4 10C4 13 6 16 10 18C14 16 16 13 16 10C16 7 14 4 10 2Z" 
      fill="var(--color-primary-light)" 
      opacity="0.6"
    />
    {/* Leaf Vein Detail */}
    <path 
      d="M10 2V18M6 6S8 8 10 9.5S14 14 14 14M6 14S8 12 10 10.5S14 6 14 6" 
      stroke="var(--color-primary-DEFAULT)" 
      strokeWidth="0.7" 
      fill="none"
      opacity="0.8"
    />
  </svg>
);
export default LeafAccentIcon;