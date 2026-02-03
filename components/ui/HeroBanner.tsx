"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  imageAlt: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  badge?: string;
  overlay?: "dark" | "darker" | "gradient";
  height?: "full" | "large" | "medium";
  children?: ReactNode;
}

export function HeroBanner({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  primaryCta,
  secondaryCta,
  badge,
  overlay = "gradient",
  height = "large",
  children,
}: HeroBannerProps) {
  const heightClasses = {
    full: "min-h-screen",
    large: "min-h-[85vh]",
    medium: "min-h-[60vh]",
  };

  const overlayClasses = {
    dark: "bg-black/60",
    darker: "bg-black/75",
    gradient: "bg-gradient-to-r from-black/90 via-black/70 to-black/40",
  };

  return (
    <section className={`relative ${heightClasses[height]} flex items-center`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Overlay */}
        <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container py-20 lg:py-32">
        <div className="max-w-3xl">
          {badge && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-jhr-gold font-medium text-body-sm sm:text-body-lg mb-4"
            >
              {badge}
            </motion.p>
          )}

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-jhr-gold font-medium text-body-sm sm:text-body-lg mb-4"
            >
              {subtitle}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-display-sm sm:text-display-md lg:text-display-lg font-display font-bold text-jhr-white mb-6"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-body-md sm:text-body-lg text-jhr-white-muted mb-8"
          >
            {description}
          </motion.p>

          {(primaryCta || secondaryCta) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {primaryCta && (
                <Link href={primaryCta.href} className="btn-primary">
                  {primaryCta.text}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href} className="btn-secondary">
                  {secondaryCta.text}
                </Link>
              )}
            </motion.div>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-jhr-white/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-jhr-gold rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Smaller hero variant for inner pages
interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  imageAlt: string;
  backLink?: {
    text: string;
    href: string;
  };
}

export function PageHero({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  backLink,
}: PageHeroProps) {
  return (
    <section className="relative min-h-[50vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container py-16 lg:py-24">
        <div className="max-w-3xl">
          {backLink && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                href={backLink.href}
                className="text-jhr-gold hover:text-jhr-gold-light transition-colors text-body-sm font-medium mb-4 inline-flex items-center gap-2"
              >
                ← {backLink.text}
              </Link>
            </motion.div>
          )}

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-jhr-gold font-medium text-body-sm sm:text-body-lg mb-4"
            >
              {subtitle}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-display-sm sm:text-display-md lg:text-display-lg font-display font-bold text-jhr-white mb-4"
          >
            {title}
          </motion.h1>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-body-md sm:text-body-lg text-jhr-white-muted"
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
