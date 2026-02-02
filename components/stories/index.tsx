"use client";

import { StoriesData } from "types";
import { StoryCard } from "./story-card";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import { motion } from "framer-motion";
import LogoIcon from "components/icons/logo";
import "@splidejs/react-splide/css/core";

interface StoriesProps {
  data: StoriesData;
}

// Custom styles for splide pagination arrows
const customStyles = `
  .stories-wrapper .splide__arrow {
    background: var(--color-monkya-yellow);
    opacity: 1;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: all 0.2s ease;
  }
  .stories-wrapper .splide__arrow:hover {
    background: var(--color-monkya-yellow);
    transform: scale(1.1);
  }
  .stories-wrapper .splide__arrow:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .stories-wrapper .splide__arrow svg {
    fill: var(--color-monkya-dark);
    width: 18px;
    height: 18px;
  }
  .stories-wrapper .splide__pagination {
    bottom: -30px;
  }
  .stories-wrapper .splide__pagination__page {
    background: #d1d5db;
    height: 8px;
    width: 8px;
    transition: all 0.2s ease;
  }
  .stories-wrapper .splide__pagination__page.is-active {
    background: var(--color-monkya-yellow);
    width: 24px;
    border-radius: 4px;
  }
`;

export function Stories({ data }: StoriesProps) {
  return (
    <>
      <style jsx global>{customStyles}</style>
      <section className="stories-wrapper w-full">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center py-8 px-4"
        >
          {/* Logo y título */}
          <div className="flex items-center gap-3 mb-2">
            <LogoIcon className="w-10 h-10 text-[--color-monkya-yellow]" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-200">
              {data.title}
            </h2>
          </div>

          {/* Subtítulo */}
          {data.subtitle && (
            <p className="text-slate-400 text-sm md:text-base text-center max-w-md">
              {data.subtitle}
            </p>
          )}
        </motion.header>

        {/* Carousel */}
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 splide-wrapper">
          <Splide
            hasTrack={false}
            options={{
              type: "loop",
              perPage: 3,
              gap: "1.5rem",
              padding: "1rem",
              breakpoints: {
                1024: {
                  perPage: 2,
                  gap: "1rem",
                },
                640: {
                  perPage: 1,
                  gap: "1rem",
                  padding: "0.5rem",
                },
              },
              pagination: true,
              arrows: true,
              lazyLoad: "nearby",
              easing: "cubic-bezier(0.25, 1, 0.5, 1)",
              speed: 600,
            }}
            extensions={{ AutoScroll }}
          >
            <div className="splide__arrows flex" aria-label="Carousel arrows">
              <button
                className="splide__arrow splide__arrow--prev absolute left-0 top-1/2 -z-10 -mt-5 flex items-center justify-center"
                aria-label="Previous slide"
              >
                <svg viewBox="0 0 40 40">
                  <path d="m15.5 20 5-5m-5 5 5 5m-5-5h15" />
                </svg>
              </button>
              <button
                className="splide__arrow splide__arrow--next absolute right-0 top-1/2 -z-10 -mt-5 flex items-center justify-center"
                aria-label="Next slide"
              >
                <svg viewBox="0 0 40 40">
                  <path d="m24.5 20-5-5m5 5-5 5m5-5H9.5" />
                </svg>
              </button>
            </div>

            <SplideTrack>
              {data.news.map((story, index) => (
                <SplideSlide key={index}>
                  <StoryCard story={story} />
                </SplideSlide>
              ))}
            </SplideTrack>
          </Splide>
        </div>
      </section>
    </>
  );
}
