"use client";

import React, { useEffect, useCallback } from "react";
import { useEditMode } from "@/context/inline-editor/EditModeContext";
import { useContent } from "@/context/inline-editor/ContentContext";
import { SectionRenderer } from "@/components/inline-editor/SectionRenderer";
import { SectionWrapper, AddSectionButton } from "@/components/inline-editor/SectionWrapper";
import { createDefaultSection } from "@/types/inline-editor";
import { getVenueContentKeyPrefix } from "@/content/schemas/venue-detail";
import type {
  PageSectionContent,
  InlineSectionType,
  SectionSEOAttributes,
} from "@/types/inline-editor";

// ============================================================================
// EditablePage — shared client component for all CMS-editable pages
// ============================================================================

export interface EditablePageProps {
  /** Page slug used for content keys and DynamoDB lookup */
  pageSlug: string;
  /** Sections fetched server-side — rendered immediately for SSR */
  initialSections: PageSectionContent[];
  /** Schema default sections for loadSectionsForPage fallback */
  defaultSections: PageSectionContent[];
  /** Per-section CSS class overrides */
  sectionClassMap?: Record<string, string>;
  /** When true, uses venue content key prefix pattern (venue-{slug}:{sectionId}) */
  isVenuePage?: boolean;
  /** Inject ReactNode after specific section IDs */
  sectionInserts?: Record<string, React.ReactNode>;
}

export function EditablePage({
  pageSlug,
  initialSections,
  defaultSections,
  sectionClassMap,
  isVenuePage,
  sectionInserts,
}: EditablePageProps) {
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
    loadSectionsForPage(pageSlug, defaultSections);
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

  // Use loaded sections once available, fall back to SSR initial sections
  const displaySections = sections.length > 0 ? sections : initialSections;
  const hasSectionInserts = sectionInserts && Object.keys(sectionInserts).length > 0;

  return (
    <div>
      {isEditMode && displaySections.length === 0 && (
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

      {displaySections.map((section, index) => {
        const sectionElement = (
          <SectionWrapper
            key={section.id}
            sectionType={section.type as InlineSectionType}
            sectionId={section.id}
            index={index}
            totalSections={displaySections.length}
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
              pageSlug={pageSlug}
              sectionClassMap={sectionClassMap}
              {...(isVenuePage ? {
                contentKeyPrefix: getVenueContentKeyPrefix(pageSlug, section.id),
              } : {})}
            />
          </SectionWrapper>
        );

        // If there are section inserts, wrap in Fragment to include injected content
        if (hasSectionInserts && sectionInserts[section.id]) {
          return (
            <React.Fragment key={section.id}>
              {sectionElement}
              {sectionInserts[section.id]}
            </React.Fragment>
          );
        }

        return sectionElement;
      })}
    </div>
  );
}
