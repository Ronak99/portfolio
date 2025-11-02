"use client";

import React from "react";
import { ExperienceItemProps } from "@/app/util/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { ProjectCard } from "./ProjectCard";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectsSectionProps {
  title?: string;
  projects: ExperienceItemProps[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  title = "Personal Projects",
  projects,
}) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [timeRemaining, setTimeRemaining] = React.useState(10000); // 10 seconds in milliseconds
  const [isPlaying, setIsPlaying] = React.useState(true);
  const autoScrollIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const AUTO_SCROLL_DURATION = 10000; // 10 seconds
  const CIRCLE_SIZE = 32; // Size of the circular progress indicator
  const CIRCLE_STROKE_WIDTH = 1;
  const CIRCLE_RADIUS = (CIRCLE_SIZE - CIRCLE_STROKE_WIDTH) / 2;
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

  // Start countdown timer
  const startCountdown = React.useCallback(() => {
    // Clear any existing countdown
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    // Reset time remaining
    setTimeRemaining(AUTO_SCROLL_DURATION);

    // Start countdown interval (update every 100ms for smooth animation)
    countdownIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 100;
        if (newTime <= 0) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          return 0;
        }
        return newTime;
      });
    }, 100);
  }, []);

  // Stop countdown timer
  const stopCountdown = React.useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  // Auto-scroll function
  const startAutoScroll = React.useCallback(() => {
    // Clear any existing interval
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    // Start countdown
    startCountdown();
    setIsPlaying(true);

    // Start new interval
    autoScrollIntervalRef.current = setInterval(() => {
      if (!api) return;

      // Check if we can scroll next
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        // If we're at the end, scroll to the beginning for infinite loop
        api.scrollTo(0);
      }
    }, AUTO_SCROLL_DURATION);
  }, [api, startCountdown]);

  // Stop auto-scroll function
  const stopAutoScroll = React.useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
    stopCountdown();
    setIsPlaying(false);
  }, [stopCountdown]);

  // Handle mouse enter (pause auto-scroll)
  const handleMouseEnter = () => {
    stopAutoScroll();
    setIsPlaying(false);
  };

  // Handle mouse leave (resume auto-scroll from current position)
  const handleMouseLeave = () => {
    if (api) {
      // Restart timer from current position
      startAutoScroll();
      setIsPlaying(true);
    }
  };

  // Toggle play/pause
  const handleTogglePlayPause = () => {
    if (isPlaying) {
      stopAutoScroll();
      setIsPlaying(false);
    } else {
      if (api) {
        startAutoScroll();
        setIsPlaying(true);
      }
    }
  };

  // Handle manual navigation (pause auto-scroll)
  const handlePrevClick = () => {
    if (isPlaying) {
      stopAutoScroll();
    }
    api?.scrollPrev();
  };

  const handleNextClick = () => {
    if (isPlaying) {
      stopAutoScroll();
    }
    api?.scrollNext();
  };

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    setCurrentIndex(api.selectedScrollSnap());

    const handleSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      setCurrentIndex(api.selectedScrollSnap());
      // Reset countdown when slide changes
      startCountdown();
    };

    api.on("select", handleSelect);

    // Start auto-scroll when api is ready
    startAutoScroll();

    // Cleanup on unmount
    return () => {
      stopAutoScroll();
      stopCountdown();
    };
  }, [api, startAutoScroll, stopAutoScroll, startCountdown, stopCountdown]);

  return (
    <div
      className="flex flex-col gap-6"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header with title and navigation buttons */}
      <div className="flex w-full justify-between items-center gap-2 sm:gap-4 flex-wrap">
        <span className="text-md font-semibold text-zinc-100">{title}</span>

          <div className="flex gap-2 items-center flex-shrink-0">
             {/* Circular Progress Indicator */}
      <CircularProgressIndicator
        timeRemaining={timeRemaining}
        totalTime={AUTO_SCROLL_DURATION}
        CIRCLE_SIZE={CIRCLE_SIZE}
        CIRCLE_RADIUS={CIRCLE_RADIUS}
        CIRCLE_STROKE_WIDTH={CIRCLE_STROKE_WIDTH}
        CIRCLE_CIRCUMFERENCE={CIRCLE_CIRCUMFERENCE}
        handleTogglePlayPause={handleTogglePlayPause}
        AUTO_SCROLL_DURATION={AUTO_SCROLL_DURATION}
        isPlaying={isPlaying}
      />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handlePrevClick}
              disabled={!canScrollPrev}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous project</span>
            </Button>
            <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {projects.length}
          </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleNextClick}
              disabled={!canScrollNext}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next project</span>
            </Button>

        </div>
      </div>

      {/* Carousel */}
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {projects.map((project, index) => (
            <CarouselItem key={index}>
              <ProjectCard
                title={project.title}
                items={project.items}
                image={project.image}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

     
    </div>
  );
};


const CircularProgressIndicator = ({
  timeRemaining,
  totalTime,
  CIRCLE_SIZE,
  CIRCLE_RADIUS,
  CIRCLE_STROKE_WIDTH,
  CIRCLE_CIRCUMFERENCE,
  handleTogglePlayPause,
  AUTO_SCROLL_DURATION,
  isPlaying,
}: {
  timeRemaining: number;
  totalTime: number;
  CIRCLE_SIZE: number;
  CIRCLE_RADIUS: number;
  CIRCLE_STROKE_WIDTH: number;
  CIRCLE_CIRCUMFERENCE: number;
  handleTogglePlayPause: () => void;
  AUTO_SCROLL_DURATION: number;
  isPlaying: boolean;
}) => {
  return (
    <div className="flex justify-center">
        <div className="relative" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
          <svg
            width={CIRCLE_SIZE}
            height={CIRCLE_SIZE}
            className="transform -rotate-90"
            onClick={handleTogglePlayPause}
            style={{ cursor: "pointer" }}
          >
            {/* Background circle */}
            <circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={CIRCLE_RADIUS}
              stroke="currentColor"
              strokeWidth={CIRCLE_STROKE_WIDTH}
              fill="none"
              className="text-muted-foreground opacity-20"
            />
            {/* Progress circle */}
            <circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={CIRCLE_RADIUS}
              stroke="currentColor"
              strokeWidth={CIRCLE_STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCLE_CIRCUMFERENCE}
              strokeDashoffset={
                CIRCLE_CIRCUMFERENCE -
                (timeRemaining / AUTO_SCROLL_DURATION) * CIRCLE_CIRCUMFERENCE
              }
              strokeLinecap="round"
              className="text-zinc-300 transition-all duration-100"
            />
          </svg>
          {/* Play/Pause Icon in center */}
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={handleTogglePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-zinc-300" />
            ) : (
              <Play className="h-4 w-4 text-zinc-300 ml-0.5" />
            )}
          </div>
        </div>
      </div>
  );
};