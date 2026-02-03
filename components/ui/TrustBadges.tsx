"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Shield,
  User,
  Camera,
  Users,
  Sparkles,
  LucideIcon,
} from "lucide-react";

interface Badge {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const photographerBadges: Badge[] = [
  {
    id: "certified",
    icon: Award,
    title: "Trained & Certified",
    description:
      "Professional photography certification with ongoing education in the latest techniques and equipment.",
  },
  {
    id: "insured",
    icon: Shield,
    title: "Fully Insured",
    description:
      "Comprehensive liability coverage for your complete peace of mind at any venue.",
  },
  {
    id: "headshot",
    icon: User,
    title: "Headshot Specialist",
    description:
      "High-volume corporate headshot expertise with AI-enhanced editing for fast turnaround.",
  },
  {
    id: "event",
    icon: Camera,
    title: "Event Coverage",
    description:
      "Conference and trade show documentation with reliable, professional results.",
  },
  {
    id: "engagement",
    icon: Users,
    title: "Engagement Expert",
    description:
      "Skilled in attendee interaction and activation experiences that drive participation.",
  },
  {
    id: "branding",
    icon: Sparkles,
    title: "Branding Pro",
    description:
      "Branded content and visual storytelling that elevates your event's marketing.",
  },
];

interface TrustBadgesProps {
  badges?: Badge[];
  title?: string;
  subtitle?: string;
  variant?: "dark" | "light";
  showLabels?: boolean;
  compact?: boolean;
}

export function TrustBadges({
  badges = photographerBadges,
  title,
  subtitle,
  variant = "dark",
  showLabels = true,
  compact = false,
}: TrustBadgesProps) {
  const [activeBadge, setActiveBadge] = useState<string | null>(null);

  const isDark = variant === "dark";

  return (
    <div className={compact ? "py-6" : "py-12"}>
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {subtitle && (
            <p
              className={`text-body-sm uppercase tracking-widest mb-2 ${
                isDark ? "text-jhr-gold" : "text-jhr-gold-dark"
              }`}
            >
              {subtitle}
            </p>
          )}
          {title && (
            <h3
              className={`text-heading-lg font-display font-bold ${
                isDark ? "text-jhr-white" : "text-jhr-black"
              }`}
            >
              {title}
            </h3>
          )}
        </div>
      )}

      <div
        className={`flex flex-wrap justify-center ${
          compact ? "gap-4 md:gap-6" : "gap-6 md:gap-8"
        }`}
      >
        {badges.map((badge) => {
          const Icon = badge.icon;
          const isActive = activeBadge === badge.id;

          return (
            <div
              key={badge.id}
              className="relative"
              onMouseEnter={() => setActiveBadge(badge.id)}
              onMouseLeave={() => setActiveBadge(null)}
            >
              {/* Badge Icon */}
              <motion.div
                className={`
                  ${compact ? "w-14 h-14 md:w-16 md:h-16" : "w-16 h-16 md:w-20 md:h-20"}
                  rounded-full flex items-center justify-center cursor-pointer transition-all duration-300
                  ${
                    isActive
                      ? "bg-jhr-gold text-jhr-black scale-110"
                      : isDark
                        ? "bg-jhr-black-lighter text-jhr-gold hover:bg-jhr-gold/20"
                        : "bg-jhr-light-border text-jhr-gold-dark hover:bg-jhr-gold/10"
                  }
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={compact ? 24 : 32} />
              </motion.div>

              {/* Tooltip */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-4 bg-jhr-black-light border border-jhr-gold/30 rounded-lg shadow-lg z-20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={16} className="text-jhr-gold" />
                      <h4 className="font-display font-semibold text-jhr-white">
                        {badge.title}
                      </h4>
                    </div>
                    <p className="text-body-sm text-jhr-white-dim">
                      {badge.description}
                    </p>

                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-jhr-black-light" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Label */}
              {showLabels && (
                <p
                  className={`text-xs text-center mt-2 max-w-[80px] ${
                    isDark ? "text-jhr-white-dim" : "text-jhr-light-text-muted"
                  }`}
                >
                  {badge.title}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Preset configurations for common use cases
export function PhotographerTrustBadges(
  props: Omit<TrustBadgesProps, "badges">
) {
  return <TrustBadges {...props} badges={photographerBadges} />;
}

// Compact inline version for CTAs
export function TrustBadgesInline() {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      {photographerBadges.slice(0, 4).map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.id}
            className="flex items-center gap-2 text-jhr-white-dim"
            title={badge.description}
          >
            <Icon size={16} className="text-jhr-gold" />
            <span className="text-body-sm hidden sm:inline">{badge.title}</span>
          </div>
        );
      })}
    </div>
  );
}
