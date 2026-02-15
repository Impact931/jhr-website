'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Pencil, Plus, Trash2, ArrowLeftRight } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';
import MediaPicker from '@/components/admin/media/MediaPicker';
import type { MediaPickerResult } from '@/types/media';
import { useEditMode } from '@/context/inline-editor/EditModeContext';
import { useContent } from '@/context/inline-editor/ContentContext';
import { EditableText } from './EditableText';
import type { TabItem } from '@/types/inline-editor';

/** Strip all HTML tags from a string for safe plain-text rendering. */
function stripHtml(html: string): string {
  if (!html.includes('<')) return html;
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

// ============================================================================
// Props
// ============================================================================

interface EditableTabbedContentProps {
  contentKeyPrefix: string;
  heading?: string;
  sectionLabel?: string;
  tabs: TabItem[];
  variant?: 'dark' | 'light';
}

// ============================================================================
// Component
// ============================================================================

export function EditableTabbedContent({
  contentKeyPrefix,
  heading,
  sectionLabel,
  tabs,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variant = 'dark',
}: EditableTabbedContentProps) {
  const { isEditMode, canEdit } = useEditMode();
  const { updateSection } = useContent();
  const showEditControls = canEdit && isEditMode;

  const [activeTab, setActiveTab] = useState(0);
  const [mediaPickerTab, setMediaPickerTab] = useState<number | null>(null);
  const tabListRef = useRef<HTMLDivElement>(null);

  // Clamp active tab if tabs array shrinks
  useEffect(() => {
    if (activeTab >= tabs.length) {
      setActiveTab(Math.max(0, tabs.length - 1));
    }
  }, [tabs.length, activeTab]);

  const sectionId = contentKeyPrefix.split(':')[1];

  // --- Helpers ---
  const updateTabs = useCallback(
    (newTabs: TabItem[]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateSection(sectionId, { tabs: newTabs } as any);
    },
    [sectionId, updateSection]
  );

  const updateTab = useCallback(
    (tabIndex: number, updates: Partial<TabItem>) => {
      const newTabs = tabs.map((t, i) => (i === tabIndex ? { ...t, ...updates } : t));
      updateTabs(newTabs);
    },
    [tabs, updateTabs]
  );

  const addTab = useCallback(() => {
    if (tabs.length >= 3) return;
    const newTab: TabItem = {
      id: `${sectionId}-tab-${Date.now()}`,
      tabLabel: `Tab ${tabs.length + 1}`,
      heading: 'New Tab Heading',
      bodyParagraphs: ['Describe this pathway or option.'],
      cta: { text: 'Learn More', href: '#' },
      image: { src: '/images/generated/placeholder.jpg', alt: 'Tab image', position: 'right' },
    };
    updateTabs([...tabs, newTab]);
    setActiveTab(tabs.length);
  }, [tabs, sectionId, updateTabs]);

  const removeTab = useCallback(
    (index: number) => {
      if (tabs.length <= 2) return;
      const newTabs = tabs.filter((_, i) => i !== index);
      updateTabs(newTabs);
      if (activeTab >= newTabs.length) setActiveTab(newTabs.length - 1);
    },
    [tabs, activeTab, updateTabs]
  );

  const toggleImagePosition = useCallback(
    (tabIndex: number) => {
      const tab = tabs[tabIndex];
      updateTab(tabIndex, {
        image: { ...tab.image, position: tab.image.position === 'right' ? 'left' : 'right' },
      });
    },
    [tabs, updateTab]
  );

  // --- Keyboard navigation for tabs ---
  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let newIndex = index;
      if (e.key === 'ArrowRight') {
        newIndex = (index + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = tabs.length - 1;
      } else {
        return;
      }
      e.preventDefault();
      setActiveTab(newIndex);
      const tabList = tabListRef.current;
      if (tabList) {
        const buttons = tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]');
        buttons[newIndex]?.focus();
      }
    },
    [tabs.length]
  );

  const currentTab = tabs[activeTab];
  if (!currentTab) return null;

  // --- Render ---

  const renderTextColumn = (tab: TabItem, tabIndex: number) => (
    <div className="flex flex-col justify-center">
      {/* Tab heading */}
      <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
        {showEditControls ? (
          <EditableText
            contentKey={`${contentKeyPrefix}:tab-${tabIndex}-heading`}
            as="span"
            className="text-white"
            onChange={(html: string) => updateTab(tabIndex, { heading: html })}
          >
            {tab.heading}
          </EditableText>
        ) : (
          tab.heading
        )}
      </h3>

      {/* Body paragraphs */}
      <div className="space-y-4 mb-6">
        {tab.bodyParagraphs.map((p, pIdx) => (
          <p key={pIdx} className="text-gray-300 text-base leading-relaxed">
            {showEditControls ? (
              <EditableText
                contentKey={`${contentKeyPrefix}:tab-${tabIndex}-p-${pIdx}`}
                as="span"
                className="text-gray-300"
                onChange={(html: string) => {
                  const newParagraphs = [...tab.bodyParagraphs];
                  newParagraphs[pIdx] = html;
                  updateTab(tabIndex, { bodyParagraphs: newParagraphs });
                }}
              >
                {p}
              </EditableText>
            ) : (
              stripHtml(p)
            )}
          </p>
        ))}
        {showEditControls && (
          <button
            onClick={() => {
              const newParagraphs = [...tab.bodyParagraphs, 'New paragraph.'];
              updateTab(tabIndex, { bodyParagraphs: newParagraphs });
            }}
            className="text-xs text-gray-500 hover:text-[#C9A227] flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add paragraph
          </button>
        )}
      </div>

      {/* Bullet list */}
      {tab.listItems && tab.listItems.length > 0 && (
        <ul className="space-y-2 mb-6">
          {tab.listItems.map((item, liIdx) => (
            <li key={liIdx} className="flex items-start gap-3 text-gray-300 text-sm">
              <span className="text-[#C9A227] mt-1 shrink-0">&mdash;</span>
              {showEditControls ? (
                <EditableText
                  contentKey={`${contentKeyPrefix}:tab-${tabIndex}-li-${liIdx}`}
                  as="span"
                  className="text-gray-300"
                  onChange={(html: string) => {
                    const newItems = [...(tab.listItems || [])];
                    newItems[liIdx] = html;
                    updateTab(tabIndex, { listItems: newItems });
                  }}
                >
                  {item}
                </EditableText>
              ) : (
                <span>{stripHtml(item)}</span>
              )}
            </li>
          ))}
          {showEditControls && (
            <li>
              <button
                onClick={() => {
                  const newItems = [...(tab.listItems || []), 'New item'];
                  updateTab(tabIndex, { listItems: newItems });
                }}
                className="text-xs text-gray-500 hover:text-[#C9A227] flex items-center gap-1 ml-6"
              >
                <Plus className="w-3 h-3" /> Add item
              </button>
            </li>
          )}
        </ul>
      )}
      {showEditControls && (!tab.listItems || tab.listItems.length === 0) && (
        <button
          onClick={() => updateTab(tabIndex, { listItems: ['First item'] })}
          className="text-xs text-gray-500 hover:text-[#C9A227] flex items-center gap-1 mb-6"
        >
          <Plus className="w-3 h-3" /> Add bullet list
        </button>
      )}

      {/* Tags */}
      {tab.tags && (
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          {showEditControls ? (
            <EditableText
              contentKey={`${contentKeyPrefix}:tab-${tabIndex}-tags`}
              as="span"
              className="text-gray-500"
              onChange={(html: string) => updateTab(tabIndex, { tags: html })}
            >
              {tab.tags}
            </EditableText>
          ) : (
            tab.tags
          )}
        </p>
      )}
      {showEditControls && !tab.tags && (
        <button
          onClick={() => updateTab(tabIndex, { tags: 'Tag one · Tag two' })}
          className="text-xs text-gray-500 hover:text-[#C9A227] flex items-center gap-1 mb-6"
        >
          <Plus className="w-3 h-3" /> Add tags
        </button>
      )}

      {/* CTA Button */}
      <div>
        <a
          href={showEditControls ? undefined : tab.cta.href}
          onClick={showEditControls ? (e: React.MouseEvent) => e.preventDefault() : undefined}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A227] text-black font-semibold rounded-lg hover:bg-[#D4AF37] transition-colors text-sm"
        >
          {showEditControls ? (
            <EditableText
              contentKey={`${contentKeyPrefix}:tab-${tabIndex}-cta-text`}
              as="span"
              className="text-black"
              onChange={(html: string) =>
                updateTab(tabIndex, { cta: { ...tab.cta, text: html } })
              }
            >
              {tab.cta.text}
            </EditableText>
          ) : (
            tab.cta.text
          )}
        </a>
        {showEditControls && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[10px] text-gray-600">Link:</span>
            <input
              type="text"
              value={tab.cta.href}
              onChange={(e) =>
                updateTab(tabIndex, { cta: { ...tab.cta, href: e.target.value } })
              }
              className="text-[10px] bg-transparent border-b border-gray-700 text-gray-400 px-1 py-0.5 w-full focus:outline-none focus:border-[#C9A227]"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderImageColumn = (tab: TabItem, tabIndex: number) => (
    <div className="relative group/img">
      <div className="rounded-xl overflow-hidden h-[300px] lg:h-[420px] relative">
        <SmartImage
          src={tab.image.src}
          alt={tab.image.alt}
          fill
          className="object-cover"
        />
      </div>
      {showEditControls && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
          <div className="flex gap-2">
            <button
              onClick={() => setMediaPickerTab(tabIndex)}
              className="p-2 bg-black/70 rounded-lg text-white hover:bg-black/90 backdrop-blur-sm"
              title="Change image"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleImagePosition(tabIndex)}
              className="p-2 bg-black/70 rounded-lg text-white hover:bg-black/90 backdrop-blur-sm"
              title="Toggle image position (left/right)"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Section label + heading */}
      {(sectionLabel || heading || showEditControls) && (
        <div className="text-center mb-10">
          {(sectionLabel || showEditControls) && (
            <p className="text-[#C9A227] text-sm font-semibold tracking-wider uppercase mb-2">
              {showEditControls ? (
                <EditableText
                  contentKey={`${contentKeyPrefix}:sectionLabel`}
                  as="span"
                  className="text-[#C9A227]"
                  placeholder="Eyebrow label..."
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(html: string) => updateSection(sectionId, { sectionLabel: html } as any)}
                >
                  {sectionLabel || ''}
                </EditableText>
              ) : (
                sectionLabel
              )}
            </p>
          )}
          {(heading || showEditControls) && (
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              {showEditControls ? (
                <EditableText
                  contentKey={`${contentKeyPrefix}:heading`}
                  as="span"
                  className="text-white"
                  placeholder="Section heading..."
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(html: string) => updateSection(sectionId, { heading: html } as any)}
                >
                  {heading || ''}
                </EditableText>
              ) : (
                heading
              )}
            </h2>
          )}
        </div>
      )}

      {/* Tab bar */}
      <div className="flex items-center justify-center mb-8">
        <div
          ref={tabListRef}
          role="tablist"
          aria-label={heading || 'Content tabs'}
          className="flex gap-1 border-b border-gray-700"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === index}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === index ? 0 : -1}
              onClick={() => setActiveTab(index)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
              className={`relative px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === index
                  ? 'text-[#C9A227]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.tabLabel}
              {/* Active underline */}
              {activeTab === index && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A227]" />
              )}
            </button>
          ))}
        </div>

        {/* Edit mode: add/remove tab buttons */}
        {showEditControls && (
          <div className="flex items-center gap-1 ml-4">
            {tabs.length < 3 && (
              <button
                onClick={addTab}
                className="p-1.5 text-gray-500 hover:text-[#C9A227] rounded"
                title="Add tab"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
            {tabs.length > 2 && (
              <button
                onClick={() => removeTab(activeTab)}
                className="p-1.5 text-gray-500 hover:text-red-400 rounded"
                title="Remove current tab"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tab label editing (edit mode only) */}
      {showEditControls && (
        <div className="flex items-center justify-center gap-4 mb-4">
          {tabs.map((tab, index) => (
            <div key={tab.id} className="flex items-center gap-1">
              <span className="text-[10px] text-gray-600">Tab {index + 1}:</span>
              <input
                type="text"
                value={tab.tabLabel}
                onChange={(e) => updateTab(index, { tabLabel: e.target.value })}
                className="text-xs bg-transparent border-b border-gray-700 text-gray-400 px-1 py-0.5 w-40 focus:outline-none focus:border-[#C9A227]"
              />
            </div>
          ))}
        </div>
      )}

      {/* Tab panels */}
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== index}
        >
          {activeTab === index && (
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center"
              style={
                tab.image.position === 'left'
                  ? { direction: 'rtl' }
                  : undefined
              }
            >
              <div style={tab.image.position === 'left' ? { direction: 'ltr' } : undefined}>
                {renderTextColumn(tab, index)}
              </div>
              <div style={tab.image.position === 'left' ? { direction: 'ltr' } : undefined}>
                {renderImageColumn(tab, index)}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Media Picker */}
      {mediaPickerTab !== null && (
        <MediaPicker
          isOpen={true}
          onClose={() => setMediaPickerTab(null)}
          onSelect={(results: MediaPickerResult[]) => {
            if (results.length > 0 && mediaPickerTab !== null) {
              updateTab(mediaPickerTab, {
                image: {
                  ...tabs[mediaPickerTab].image,
                  src: results[0].publicUrl,
                },
              });
            }
            setMediaPickerTab(null);
          }}
          options={{ allowedTypes: ['image'] }}
        />
      )}
    </div>
  );
}
