"use client";

import { useEffect, useCallback } from "react";
import { useEditMode } from "@/context/inline-editor/EditModeContext";
import { useContent } from "@/context/inline-editor/ContentContext";
import { EVS_SECTIONS } from "@/content/schemas/event-video-systems";
import { SectionRenderer } from "@/components/inline-editor/SectionRenderer";
import { SectionWrapper, AddSectionButton } from "@/components/inline-editor/SectionWrapper";
import { createDefaultSection } from "@/types/inline-editor";
import type {
  PageSectionContent,
  InlineSectionType,
  SectionSEOAttributes,
} from "@/types/inline-editor";

// ============================================================================
// Event Video Systems Service Page - Editable with inline CMS
// ============================================================================

const SECTION_CLASS_MAP: Record<string, string> = {
  "value-prop": "section-padding section-light",
  "services": "section-padding bg-[#0B0C0F]",
  "use-cases": "section-padding section-light",
  "process": "section-padding bg-[#0B0C0F]",
  "gallery": "section-padding section-light",
  "social-proof": "section-padding bg-[#0B0C0F]",
  "faqs": "section-padding section-light",
  "final-cta": "section-padding bg-[#0B0C0F]",
};

export default function EventVideoSystemsPage() {
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
    loadSectionsForPage('event-video-systems', EVS_SECTIONS);
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
            pageSlug="event-video-systems"
            sectionClassMap={SECTION_CLASS_MAP}
          />
        </SectionWrapper>
      ))}
    </div>
  );
}
