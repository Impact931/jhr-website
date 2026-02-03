"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface ProcessTimelineProps {
  steps: ProcessStep[];
  variant?: "dark" | "light";
}

export function ProcessTimeline({
  steps,
  variant = "dark",
}: ProcessTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const isDark = variant === "dark";

  return (
    <div ref={containerRef} className="relative">
      {/* Central Timeline Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
        {/* Background line */}
        <div
          className={`absolute inset-0 ${
            isDark ? "bg-jhr-black-lighter" : "bg-jhr-light-border"
          }`}
        />
        {/* Animated progress line */}
        <motion.div
          className="absolute top-0 left-0 right-0 bg-jhr-gold origin-top"
          style={{ height: lineHeight }}
        />
      </div>

      {/* Timeline Steps */}
      <div className="space-y-24 md:space-y-32">
        {steps.map((step, index) => (
          <TimelineStep
            key={step.id}
            step={step}
            isEven={index % 2 === 0}
            index={index}
            totalSteps={steps.length}
            scrollYProgress={scrollYProgress}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
}

interface TimelineStepProps {
  step: ProcessStep;
  isEven: boolean;
  index: number;
  totalSteps: number;
  scrollYProgress: MotionValue<number>;
  isDark: boolean;
}

function TimelineStep({
  step,
  isEven,
  index,
  totalSteps,
  scrollYProgress,
  isDark,
}: TimelineStepProps) {
  const stepProgress = useTransform(
    scrollYProgress,
    [index / totalSteps, (index + 1) / totalSteps],
    [0, 1]
  );

  const opacity = useTransform(stepProgress, [0, 0.5], [0.3, 1]);
  const scale = useTransform(stepProgress, [0, 0.5], [0.8, 1]);

  const Icon = step.icon;

  return (
    <motion.div
      className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
        isEven ? "md:text-right" : "md:text-left"
      }`}
      style={{ opacity }}
    >
      {/* Content Side */}
      <motion.div
        className={`space-y-4 ${
          isEven ? "md:pr-16" : "md:pl-16 md:order-2"
        }`}
        style={{ scale }}
      >
        <span
          className={`inline-block px-3 py-1 text-xs font-display uppercase tracking-wider rounded ${
            isDark
              ? "bg-jhr-gold/10 text-jhr-gold"
              : "bg-jhr-gold/20 text-jhr-gold-dark"
          }`}
        >
          Step {step.id}
        </span>
        <h3
          className={`text-heading-lg md:text-display-sm font-display font-bold ${
            isDark ? "text-jhr-white" : "text-jhr-black"
          }`}
        >
          {step.title}
        </h3>
        <p
          className={`text-body-md leading-relaxed ${
            isDark ? "text-jhr-white-dim" : "text-jhr-light-text-muted"
          }`}
        >
          {step.description}
        </p>
      </motion.div>

      {/* Icon Side */}
      <motion.div
        className={`flex justify-center ${
          isEven
            ? "md:justify-start md:pl-16"
            : "md:justify-end md:pr-16 md:order-1"
        }`}
        style={{ scale }}
      >
        <div className="relative">
          {/* Icon Container */}
          <motion.div
            className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center border-2 transition-colors ${
              isDark
                ? "bg-jhr-black-light border-jhr-gold/30 hover:border-jhr-gold/80"
                : "bg-white border-jhr-gold/30 hover:border-jhr-gold/80 shadow-md"
            }`}
            whileHover={{ scale: 1.1 }}
          >
            <Icon
              size={40}
              className={isDark ? "text-jhr-gold" : "text-jhr-gold-dark"}
            />
          </motion.div>

          {/* Pulse Effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-jhr-gold/20"
            animate={{
              scale: [1, 1.3, 1.3],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </div>
      </motion.div>

      {/* Center Node */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
        <motion.div
          className="w-4 h-4 rounded-full bg-jhr-gold glow-gold-strong"
          style={{ scale: useTransform(stepProgress, [0, 0.5], [0.5, 1]) }}
        />
      </div>
    </motion.div>
  );
}

// Simple vertical timeline for mobile or compact views
interface SimpleTimelineProps {
  steps: ProcessStep[];
  variant?: "dark" | "light";
}

export function SimpleTimeline({ steps, variant = "dark" }: SimpleTimelineProps) {
  const isDark = variant === "dark";

  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className={`absolute left-6 top-0 bottom-0 w-px ${
          isDark ? "bg-jhr-black-lighter" : "bg-jhr-light-border"
        }`}
      />

      <div className="space-y-8">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <motion.div
              key={step.id}
              className="relative pl-16"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              {/* Icon node */}
              <div
                className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  isDark
                    ? "bg-jhr-black-light border border-jhr-gold/30"
                    : "bg-white border border-jhr-gold/30 shadow-sm"
                }`}
              >
                <Icon
                  size={20}
                  className={isDark ? "text-jhr-gold" : "text-jhr-gold-dark"}
                />
              </div>

              {/* Content */}
              <div>
                <span
                  className={`text-body-sm font-medium ${
                    isDark ? "text-jhr-gold" : "text-jhr-gold-dark"
                  }`}
                >
                  Step {step.id}
                </span>
                <h4
                  className={`text-heading-md font-semibold mt-1 ${
                    isDark ? "text-jhr-white" : "text-jhr-black"
                  }`}
                >
                  {step.title}
                </h4>
                <p
                  className={`text-body-sm mt-2 ${
                    isDark ? "text-jhr-white-dim" : "text-jhr-light-text-muted"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
