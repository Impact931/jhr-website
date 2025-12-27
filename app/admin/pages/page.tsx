'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  ExternalLink,
  ChevronRight,
  Search,
  Home,
  Briefcase,
  Building2,
  MapPin,
} from 'lucide-react';
import {
  pagesSchema,
  categoryLabels,
  PageSchema,
} from '@/lib/pages-schema';

const categoryIcons: Record<PageSchema['category'], React.ElementType> = {
  main: Home,
  services: Briefcase,
  solutions: Building2,
  venues: MapPin,
};

export default function AdminPagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PageSchema['category'] | 'all'>('all');

  // Filter pages based on search and category
  const filteredPages = pagesSchema.filter((page) => {
    const matchesSearch =
      searchQuery === '' ||
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || page.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Group pages by category
  const groupedPages = filteredPages.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = [];
    }
    acc[page.category].push(page);
    return acc;
  }, {} as Record<PageSchema['category'], PageSchema[]>);

  const categories: (PageSchema['category'] | 'all')[] = ['all', 'main', 'services', 'solutions', 'venues'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-jhr-white mb-2">Pages</h2>
        <p className="text-jhr-white-dim">
          Edit content on your website pages. Click on a page to edit its sections.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jhr-white-dim" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pages..."
            className="w-full pl-10 pr-4 py-2 bg-jhr-black border border-jhr-black-lighter rounded-lg text-jhr-white placeholder-jhr-white-dim focus:outline-none focus:border-jhr-gold"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-jhr-gold text-jhr-black font-medium'
                  : 'text-jhr-white-dim hover:bg-jhr-black-lighter'
              }`}
            >
              {category === 'all' ? 'All' : categoryLabels[category]}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm text-jhr-white-dim">
        <span>{filteredPages.length} pages</span>
        <span className="text-jhr-black-lighter">|</span>
        <span>{pagesSchema.reduce((acc, p) => acc + p.sections.length, 0)} total sections</span>
      </div>

      {/* Pages List */}
      {Object.entries(groupedPages).length === 0 ? (
        <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-jhr-white-dim mx-auto mb-4" />
          <h3 className="text-lg font-medium text-jhr-white mb-2">No pages found</h3>
          <p className="text-jhr-white-dim">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {(Object.entries(groupedPages) as [PageSchema['category'], PageSchema[]][]).map(
            ([category, pages]) => {
              const CategoryIcon = categoryIcons[category];
              return (
                <div key={category}>
                  {/* Category Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <CategoryIcon className="w-5 h-5 text-jhr-gold" />
                    <h3 className="text-lg font-semibold text-jhr-white">
                      {categoryLabels[category]}
                    </h3>
                    <span className="text-sm text-jhr-white-dim">({pages.length})</span>
                  </div>

                  {/* Pages Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pages.map((page) => (
                      <Link
                        key={page.id}
                        href={`/admin/pages/${page.id}`}
                        className="group bg-jhr-black-light border border-jhr-black-lighter rounded-xl p-4 hover:border-jhr-gold/50 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 bg-jhr-black-lighter rounded-lg flex items-center justify-center group-hover:bg-jhr-gold/10 transition-colors">
                            <FileText className="w-5 h-5 text-jhr-white-dim group-hover:text-jhr-gold transition-colors" />
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={page.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 text-jhr-white-dim hover:text-jhr-gold transition-colors"
                              title="View live page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <ChevronRight className="w-5 h-5 text-jhr-white-dim group-hover:text-jhr-gold transition-colors" />
                          </div>
                        </div>

                        <h4 className="text-jhr-white font-medium mb-1 group-hover:text-jhr-gold transition-colors">
                          {page.name}
                        </h4>
                        <p className="text-sm text-jhr-white-dim line-clamp-2 mb-3">
                          {page.description}
                        </p>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-jhr-white-dim">
                            {page.sections.length} section{page.sections.length !== 1 ? 's' : ''}
                          </span>
                          <span className="text-jhr-gold/70 font-mono">{page.path}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
