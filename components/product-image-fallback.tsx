'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function ProductImage({ src, alt, width, height, className }: ProductImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError || src.startsWith('/placeholder-')) {
    // Determinar color basado en el nombre del producto
    const isBlack = alt.toLowerCase().includes('negra') || alt.toLowerCase().includes('black');
    const isGray = alt.toLowerCase().includes('gris') || alt.toLowerCase().includes('gray');
    const isHoodie = alt.toLowerCase().includes('hoodie');
    
    let bgColor = 'bg-white';
    let textColor = 'text-gray-800';
    let borderColor = 'border-gray-300';
    
    if (isBlack) {
      bgColor = 'bg-gray-900';
      textColor = 'text-white';
      borderColor = 'border-gray-700';
    } else if (isGray) {
      bgColor = 'bg-gray-500';
      textColor = 'text-white';
      borderColor = 'border-gray-400';
    }

    return (
      <div 
        className={`${bgColor} ${textColor} ${borderColor} border-2 flex flex-col items-center justify-center ${className}`}
        style={{ width, height, aspectRatio: '1 / 1' }}
      >
        <div className="text-center p-4">
          <div className="text-2xl mb-2">
            {isHoodie ? '🧥' : '👕'}
          </div>
          <div className="text-sm font-medium">
            {alt.split(' - ')[0]}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}