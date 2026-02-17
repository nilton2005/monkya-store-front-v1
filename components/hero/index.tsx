"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "utils/cn";
import { Clips } from "./clips";
import { SocialLink } from "./social-link";
import type { HeroData } from "types";

interface HeroProps {
  data: HeroData;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.25, 0, 1],
    },
  },
};

export function Hero({ data }: HeroProps) {
  const { title, subtitle, btntext, btnHref, img, videos, sociallinks } = data;

  return (
    <section className="relative w-full overflow-hidden h-[16rem] sm:h-[20rem] md:h-[24rem] lg:h-[28rem] xl:h-[33vh]">
      {/* Background with clip-path */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 right-0 z-10 w-full"
        style={{
          height: '100%',
          background: "linear-gradient(135deg, rgba(39, 37, 18, 1) 0%, rgba(242, 205, 78, 0.3) 100%)",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 85%)",
        }}
      />

      {/* Video clips - left side */}
      {videos && videos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute left-2 sm:left-3 md:left-4 lg:left-6 z-30 flex flex-col gap-2 items-center justify-center"
          style={{ height: '100%', top: 0 }}
        >
          {videos.map((val, i) => (
            <Clips key={i} clip={val} />
          ))}
        </motion.div>
      )}

      {/* Social links - right side */}
      {sociallinks && sociallinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute right-2 sm:right-3 md:right-4 lg:right-6 z-30 flex flex-col gap-3 items-center justify-center"
          style={{ height: '100%', top: 0 }}
        >
          {sociallinks.map((val, i) => (
            <SocialLink key={i} item={val} />
          ))}
        </motion.div>
      )}

      {/* Main content - centered vertically */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
        style={{ height: '100%' }}
      >
        {/* Titles and button */}
        <div className="flex flex-col items-center mb-3">
          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold drop-shadow-sm text-slate-200 text-center leading-tight mb-1"
          >
            {title}
          </motion.h1>
          <motion.h1
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold drop-shadow-sm text-slate-200 text-center leading-tight mb-2"
          >
            {subtitle}
          </motion.h1>

          {/* Button */}
          <motion.div variants={itemVariants}>
            {btnHref ? (
              <Link
                href={btnHref}
                className={cn(
                  "inline-block px-5 py-2 rounded-lg",
                  "bg-[--color-monkya-yellow] text-[--color-monkya-dark]",
                  "text-sm sm:text-base font-semibold shadow-lg",
                  "transition-all duration-100 ease-in-out",
                  "hover:scale-105 active:scale-95",
                  "hover:shadow-xl"
                )}
              >
                {btntext}
              </Link>
            ) : (
              <button
                type="button"
                className={cn(
                  "px-5 py-2 rounded-lg",
                  "bg-[--color-monkya-yellow] text-[--color-monkya-dark]",
                  "text-sm sm:text-base font-semibold shadow-lg",
                  "transition-all duration-100 ease-in-out",
                  "hover:scale-105 active:scale-95",
                  "hover:shadow-xl"
                )}
              >
                {btntext}
              </button>
            )}
          </motion.div>
        </div>

        {/* Main image */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center"
        >
          <div className="relative w-auto h-36 sm:h-44 md:h-52 lg:h-60 xl:h-64 transition-all duration-700 ease-in-out -rotate-[25deg] hover:rotate-0 cursor-pointer">
            <Image
              src={img}
              alt="hero image"
              width={400}
              height={400}
              className="object-contain"
              priority
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;
