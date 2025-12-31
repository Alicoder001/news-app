'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function Pagination({ currentPage, totalPages, basePath = '' }: PaginationProps) {
  const searchParams = useSearchParams();
  
  if (totalPages <= 1) return null;
  
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'dots')[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or less
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) pages.push('dots');
      
      // Show pages around current
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('dots');
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${basePath}?${params.toString()}`;
  };
  
  const pages = getPageNumbers();
  
  return (
    <nav className="flex items-center justify-center gap-1 py-8" aria-label="Pagination">
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="px-3 py-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
        >
          ← Oldingi
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm font-medium text-foreground/30 cursor-not-allowed">
          ← Oldingi
        </span>
      )}
      
      {/* Page numbers */}
      <div className="flex items-center gap-1 mx-2">
        {pages.map((page, i) => 
          page === 'dots' ? (
            <span key={`dots-${i}`} className="px-2 text-foreground/40">...</span>
          ) : (
            <Link
              key={page}
              href={buildHref(page)}
              className={`min-w-[36px] h-9 flex items-center justify-center text-sm font-medium rounded-md transition-colors ${
                currentPage === page
                  ? 'bg-foreground text-background'
                  : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
              }`}
            >
              {page}
            </Link>
          )
        )}
      </div>
      
      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="px-3 py-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
        >
          Keyingi →
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm font-medium text-foreground/30 cursor-not-allowed">
          Keyingi →
        </span>
      )}
    </nav>
  );
}
