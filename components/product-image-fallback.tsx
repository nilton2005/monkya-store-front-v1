'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
}

export default function ProductImage({ 
  src, 
  alt, 
  width, 
  height, 
  fill,
  sizes,
  className 
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError || src.startsWith('/placeholder-')) {
    // Determinar color basado en el nombre del producto
    const isBlack = alt.toLowerCase().includes('negra') || alt.toLowerCase().includes('black') || alt.toLowerCase().includes('negro');
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

    const style = fill 
      ? {} 
      : { width: width || 600, height: height || 600, aspectRatio: '1 / 1' };

    return (
      <div 
        className={`${bgColor} ${textColor} ${borderColor} border-2 flex flex-col items-center justify-center ${fill ? 'absolute inset-0' : ''} ${className}`}
        style={style}
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

  // Props comunes para el componente Image
  const imageProps: any = {
    src,
    alt,
    className,
    onError: () => setImageError(true)
  };

  // Agregar width/height o fill según corresponda
  if (fill) {
    imageProps.fill = true;
    if (sizes) imageProps.sizes = sizes;
  } else {
    imageProps.width = width || 600;
    imageProps.height = height || 600;
  }

  return <Image {...imageProps} />;
}