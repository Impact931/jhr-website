"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import { useEditMode } from "@/context/inline-editor/EditModeContext";
import { useContent } from "@/context/inline-editor/ContentContext";
import { VENUES_SECTIONS } from "@/content/schemas/venues";
import { SectionRenderer } from "@/components/inline-editor/SectionRenderer";
import { SectionWrapper, AddSectionButton } from "@/components/inline-editor/SectionWrapper";
import { createDefaultSection } from "@/types/inline-editor";
import type {
  PageSectionContent,
  InlineSectionType,
  SectionSEOAttributes,
  FeatureGridSectionContent,
} from "@/types/inline-editor";

// ============================================================================
// Venues Hub Page - Editable with inline CMS
// ============================================================================

const VENUE_TYPES = ["All", "Hotel", "Convention Center", "Event Center", "Honky Tonk", "Park"] as const;

const SECTION_CLASS_MAP: Record<string, string> = {
  "venues-grid": "section-padding bg-jhr-black-light",
};

export default function VenuesPage() {
  const { isEditMode } = useEditMode();
  const [activeFilter, setActiveFilter] = useState<string>("All");
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
    loadSectionsForPage('venues', VENUES_SECTIONS);
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

  // Filter the venues-grid section features by category
  const filteredSections = useMemo(() => {
    if (activeFilter === "All" || isEditMode) return sections;
    return sections.map((section) => {
      if (section.id === "venues-grid" && section.type === "feature-grid") {
        const grid = section as FeatureGridSectionContent;
        return {
          ...grid,
          features: grid.features.filter(
            (f) => f.category === activeFilter
          ),
        };
      }
      return section;
    });
  }, [sections, activeFilter, isEditMode]);

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

      {filteredSections.map((section, index) => {
        // Inject filter bar above the venues-grid section
        const showFilter = section.id === "venues-grid" && !isEditMode;

        return (
          <div key={section.id}>
            {showFilter && (
              <VenueFilterBar
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            )}
            <SectionWrapper
              sectionType={section.type as InlineSectionType}
              sectionId={section.id}
              index={index}
              totalSections={filteredSections.length}
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
                pageSlug="venues"
                sectionClassMap={SECTION_CLASS_MAP}
              />
            </SectionWrapper>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Venue Filter Bar
// ============================================================================

function VenueFilterBar({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}) {
  return (
    <div className="bg-jhr-black-light border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2">
        <nav
          className="flex flex-wrap items-center gap-2 sm:gap-3"
          aria-label="Filter venues by type"
        >
          {VENUE_TYPES.map((type) => {
            const isActive = activeFilter === type;
            return (
              <button
                key={type}
                onClick={() => onFilterChange(type)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${isActive
                    ? "bg-jhr-gold text-jhr-dark shadow-lg shadow-jhr-gold/20"
                    : "bg-white/5 text-jhr-white-muted hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {type}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
