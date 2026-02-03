"use client";

import { useEffect, useCallback } from "react";
import { useEditMode } from "@/context/inline-editor/EditModeContext";
import { useContent } from "@/context/inline-editor/ContentContext";
import { VSOL_SECTIONS } from "@/content/schemas/venues-solution";
import { SectionRenderer } from "@/components/inline-editor/SectionRenderer";
import { SectionWrapper, AddSectionButton } from "@/components/inline-editor/SectionWrapper";
import { createDefaultSection } from "@/types/inline-editor";
import type {
  PageSectionContent,
  InlineSectionType,
  SectionSEOAttributes,
} from "@/types/inline-editor";

// ============================================================================
// Static FAQ data for JSON-LD schema
// ============================================================================

const staticFaqs = [
  {
    question: "Are you familiar with venue vendor requirements?",
    answer:
      "Yes. We understand EAC processes, insurance requirements, load-in procedures, and union considerations for Nashville's major venues. We handle our paperwork and coordinate with venue contacts as needed.",
  },
  {
    question: "Can you be added to our preferred vendor list?",
    answer:
      "Absolutely. We'd welcome the opportunity to discuss our qualifications and how we can serve your clients. We can provide insurance certificates, references, and portfolio samples.",
  },
  {
    question: "How do you coordinate with venue staff?",
    answer:
      "We arrive early, introduce ourselves to key personnel, and establish clear communication protocols. We're experienced working alongside AV teams, catering staff, and venue operations. We fit into your ecosystem—not the other way around.",
  },
  {
    question: "What if a client needs last-minute photography?",
    answer:
      "We understand events change. While we prefer advance booking, we can often accommodate last-minute needs. Contact us and we'll do our best to help your client.",
  },
  {
    question: "Do you photograph the venue itself for marketing purposes?",
    answer:
      "Yes. We can provide venue photography for your marketing materials—both empty space documentation and event-in-progress images that show your venue at its best.",
  },
];

// ICP Page Schema
const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Photography Services for Venue Coordinators",
  description:
    "JHR Photography partners with Nashville venues as a preferred photography vendor.",
  provider: {
    "@type": "Organization",
    name: "JHR Photography",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: staticFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

// ============================================================================
// Venues Solution Page - Editable with inline CMS
// ============================================================================

const SECTION_CLASS_MAP: Record<string, string> = {
  "partnership": "section-padding bg-jhr-black-light",
  "venue-experience": "section-padding bg-jhr-black-light",
};

export default function VenueCoordinatorsPage() {
  const { isEditMode } = useEditMode();
  const {
    sections,
    loadSectionsForPage,
    addSection,
    updateSection,
    deleteSection,
    moveSectionUp,
    moveSectionDown,
  } = useContent();

  useEffect(() => {
    loadSectionsForPage('venues-solution', VSOL_SECTIONS);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddSection = useCallback(
    (type: InlineSectionType, afterIndex: number) => {
      const newSection = createDefaultSection(type, afterIndex + 1);
      addSection(newSection, afterIndex + 1);
    },
    [addSection]
  );

  const handleAddSectionWithContent = useCallback(
    (section: PageSectionContent, afterIndex: number) => {
      addSection(section, afterIndex + 1);
    },
    [addSection]
  );

  const handleUpdateSEO = useCallback(
    (sectionId: string, seo: SectionSEOAttributes) => {
      updateSection(sectionId, { seo } as Partial<PageSectionContent>);
    },
    [updateSection]
  );

  return (
    <div className="pt-16 lg:pt-20">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {isEditMode && sections.length === 0 && (
        <AddSectionButton
          onAddSection={(type) => {
            const newSection = createDefaultSection(type, 0);
            addSection(newSection, 0);
          }}
          onAddSectionWithContent={(section) => {
            addSection(section, 0);
          }}
          variant="first"
          insertOrder={0}
        />
      )}

      {sections.map((section, index) => (
        <SectionWrapper
          key={section.id}
          sectionType={section.type as InlineSectionType}
          sectionId={section.id}
          index={index}
          totalSections={sections.length}
          {...(isEditMode ? {
            onMoveUp: moveSectionUp,
            onMoveDown: moveSectionDown,
            onDelete: deleteSection,
            onAddSection: handleAddSection,
            onAddSectionWithContent: handleAddSectionWithContent,
            onUpdateSEO: handleUpdateSEO,
          } : {})}
          sectionSEO={section.seo}
        >
          <SectionRenderer
            section={section}
            pageSlug="venues-solution"
            sectionClassMap={SECTION_CLASS_MAP}
          />
        </SectionWrapper>
      ))}
    </div>
  );
}
