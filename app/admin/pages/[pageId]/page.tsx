'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { pagesSchema } from '@/lib/pages-schema';
import { Loader2 } from 'lucide-react';

export default function PageEditorRedirect() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.pageId as string;

  useEffect(() => {
    // Find the page in schema
    const page = pagesSchema.find((p) => p.id === pageId);

    if (page) {
      // Redirect to the actual page - the EditorWrapper will show edit tools
      // since user is authenticated
      window.location.href = page.path;
    } else {
      router.push('/admin/pages');
    }
  }, [pageId, router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3 text-jhr-white-dim">
        <Loader2 className="w-8 h-8 animate-spin text-jhr-gold" />
        <span>Opening page editor...</span>
      </div>
    </div>
  );
}
