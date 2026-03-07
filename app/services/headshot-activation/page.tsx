import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { HA_SECTIONS } from '@/content/schemas/headshot-activation';
import { ROICalculator } from '@/components/ui/ROICalculator';

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

export default async function HeadshotActivationPage() {
  const sections = await getSSRSections('headshot-activation');
  return (
    <EditablePage
      pageSlug="headshot-activation"
      initialSections={sections}
      defaultSections={HA_SECTIONS}
      sectionClassMap={SECTION_CLASS_MAP}
      sectionInserts={{
        'use-cases': (
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
        ),
      }}
    />
  );
}
