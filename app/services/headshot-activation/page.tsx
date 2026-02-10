"use client";

import React, { useEffect, useCallback } from "react";
import { ROICalculator } from "@/components/ui/ROICalculator";
import { useEditMode } from "@/context/inline-editor/EditModeContext";
import { useContent } from "@/context/inline-editor/ContentContext";
import { HA_SECTIONS } from "@/content/schemas/headshot-activation";
import { SectionRenderer } from "@/components/inline-editor/SectionRenderer";
import { SectionWrapper, AddSectionButton } from "@/components/inline-editor/SectionWrapper";
import { createDefaultSection } from "@/types/inline-editor";
import type {
  PageSectionContent,
  InlineSectionType,
  SectionSEOAttributes,
} from "@/types/inline-editor";

// ============================================================================
// Headshot Activation Service Page - Editable with inline CMS
// ============================================================================

const SECTION_CLASS_MAP: Record<string, string> = {
  'stats': 'section-padding-sm bg-[#0B0C0F]',
  'problem': 'section-padding section-light',
  'solution': 'section-padding section-light',
  'gallery-strip-1': 'py-6 section-light',
  'use-cases': 'section-padding bg-[#0B0C0F]',
  'whats-included': 'section-padding section-light',
  'gallery-strip-2': 'py-6 section-light',
  'headshot-styles': 'section-padding section-light',
  'social-proof': 'section-padding bg-[#0B0C0F]',
  'faqs': 'section-padding section-light',
  'final-cta': 'section-padding bg-[#0B0C0F]',
};

export default function HeadshotActivationPage() {
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
    loadSectionsForPage('headshot-activation', HA_SECTIONS);
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
    <div>
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
        <React.Fragment key={section.id}>
          <SectionWrapper
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
              pageSlug="headshot-activation"
              sectionClassMap={SECTION_CLASS_MAP}
            />
          </SectionWrapper>

          {/* ROI Calculator - injected after use-cases section */}
          {section.id === 'use-cases' && (
            <section className="section-padding section-light">
              <div className="section-container">
                <div className="text-center mb-12">
                  <p className="text-jhr-gold-dark font-medium text-body-lg mb-2">Calculate Your Value</p>
                  <h2 className="text-display-sm font-display font-bold text-jhr-black mb-4">
                    See What Your Activation Could Deliver
                  </h2>
                </div>
                <ROICalculator variant="light" />
              </div>
            </section>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
