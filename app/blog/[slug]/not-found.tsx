import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BlogPostNotFound() {
  return (
    <main className="min-h-screen bg-jhr-black">
      <section className="pt-32 pb-16">
        <div className="section-container text-center">
          <h1 className="text-display-md font-display font-bold text-jhr-white mb-4">
            Post Not Found
          </h1>
          <p className="text-body-lg text-jhr-white-dim mb-8">
            The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </section>
    </main>
  );
}
