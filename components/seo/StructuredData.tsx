/**
 * StructuredData Component
 *
 * Renders JSON-LD structured data as <script type="application/ld+json"> tags.
 * Designed to be placed in the page head or body for SEO.
 *
 * Usage:
 *   <StructuredData schemas={generatePageStructuredData({ ... })} />
 *
 * Or for a single schema:
 *   <StructuredDataScript data={generateOrganizationSchema().data} />
 */

import type { StructuredDataSchema } from '@/lib/structured-data';

// ============================================================================
// Single Schema Script Tag
// ============================================================================

/**
 * Renders a single JSON-LD script tag.
 */
export function StructuredDataScript({
  data,
}: {
  data: Record<string, unknown>;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ============================================================================
// Multiple Schemas Component
// ============================================================================

/**
 * Renders multiple JSON-LD structured data schemas as script tags.
 * Each schema is rendered as a separate <script> tag.
 */
export function StructuredData({
  schemas,
}: {
  schemas: StructuredDataSchema[];
}) {
  if (schemas.length === 0) return null;

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`sd-${schema.type}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema.data) }}
        />
      ))}
    </>
  );
}
