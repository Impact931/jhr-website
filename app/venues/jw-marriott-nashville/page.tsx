"use client";

import { useEffect, useCallback } from "react";
import { useEditMode } from "@/context/inline-editor/EditModeContext";
import { useContent } from "@/context/inline-editor/ContentContext";
import {
  JW_MARRIOTT_SCHEMA,
  getVenueContentKeyPrefix,
} from "@/content/schemas/venue-detail";
import { SectionRenderer } from "@/components/inline-editor/SectionRenderer";
import { SectionWrapper, AddSectionButton } from "@/components/inline-editor/SectionWrapper";
import { createDefaultSection } from "@/types/inline-editor";
import type {
  PageSectionContent,
  InlineSectionType,
  SectionSEOAttributes,
} from "@/types/inline-editor";

const VENUE_SLUG = "jw-marriott-nashville";

const SECTION_CLASS_MAP: Record<string, string> = {
  experience: "section-padding bg-jhr-black-light",
  services: "section-padding bg-jhr-black-light",
};

export default function JWMarriottPage() {
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
    loadSectionsForPage(VENUE_SLUG, JW_MARRIOTT_SCHEMA.sections);
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
            pageSlug={VENUE_SLUG}
            contentKeyPrefix={getVenueContentKeyPrefix(VENUE_SLUG, section.id)}
            sectionClassMap={SECTION_CLASS_MAP}
          />
        </SectionWrapper>
      ))}
    </div>
  );
}
