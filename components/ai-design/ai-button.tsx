'use client';

import Link from 'next/link';
import {Gochi_Hand} from 'next/font/google';
import { cn } from 'lib/utils';

// configuracion de la fuente
const fontHand = Gochi_Hand({
  subsets: ['latin'],
  weight: ['400']
})


export function AIDesignButton(){
  return (
    <Link 
    href="/ai-designer"
    className={cn(
      "relative flex item-center justify-center transition-all duration-300",
      "bg-black text-white border-2 border-white",
      "rounded-2xl px-6 py-2",
      "hover:scale-105 hover:shadow-[0_0_15px_rgba(255, 255, 255, 0, 0.5)]",
      fontHand.className
    )}
    aria-label='Diseñar con IA'
    >
      <span className="text-xl tracking-wide">Diseña tu ropa con IA</span>
      
      <span
      className='absolute -top-1 -right-1 flex h-3 w-3'
      >
        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75'> </span>
        <span className='relative inline-flex rounded-full h-3 w-3 bg-white'></span>

      </span>
    
    </Link>
  );
}
