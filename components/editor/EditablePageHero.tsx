'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

interface EditablePageHeroProps {
  pageId: string;
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

export function EditablePageHero({
  pageId,
  title,
  subtitle,
  description,
  image,
  imageAlt,
  backLink,
}: EditablePageHeroProps) {
  return (
    <section className="relative min-h-[50vh] flex items-center">
      {/* Background Image - Editable */}
      <div className="absolute inset-0 z-0">
        <EditableImage
          pageId={pageId}
          sectionId="hero"
          contentKey="backgroundImage"
          defaultSrc={image}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50 z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 section-container py-16 lg:py-24">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4"
            >
              <EditableText
                pageId={pageId}
                sectionId="hero"
                contentKey="subtitle"
                defaultValue={subtitle}
                as="p"
                className="text-jhr-gold font-medium text-body-lg"
                contentType="tagline"
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <EditableText
              pageId={pageId}
              sectionId="hero"
              contentKey="title"
              defaultValue={title}
              as="h1"
              className="text-display-lg font-display font-bold text-jhr-white"
              contentType="heading"
            />
          </motion.div>

          {description && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <EditableText
                pageId={pageId}
                sectionId="hero"
                contentKey="description"
                defaultValue={description}
                as="p"
                className="text-body-lg text-jhr-white-muted"
                contentType="paragraph"
                multiline
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
