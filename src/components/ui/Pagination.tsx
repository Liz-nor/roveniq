import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

// Shows first, last and the pages around the current one, e.g. 1 … 4 5 6 … 15
function getPageNumbers(currentPage: number, totalPages: number): (number | '…')[] {
    const pages: (number | '…')[] = [];

    for (let page = 1; page <= totalPages; page++) {
        const isEdge = page === 1 || page === totalPages;
        const isNearCurrent = Math.abs(page - currentPage) <= 1;

        if (isEdge || isNearCurrent) {
            pages.push(page);
        } else if (pages[pages.length - 1] !== '…') {
            pages.push('…');
        }
    }

    return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const arrowClass =
        'flex h-10 w-10 items-center justify-center rounded-full text-teal-700 hover:bg-teal-50 disabled:opacity-40 disabled:hover:bg-transparent';

    return (
        <nav aria-label="Venue pages" className="mt-8 flex items-center justify-center gap-2">
            <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={arrowClass}
            >
                <ChevronLeft size={20} />
            </button>

            {getPageNumbers(currentPage, totalPages).map((page, index) =>
                page === '…' ? (
                    <span key={`gap-${index}`} className="px-1 text-neutral-500">
                        …
                    </span>
                ) : (
                    <button
                        key={page}
                        type="button"
                        aria-current={page === currentPage ? 'page' : undefined}
                        onClick={() => onPageChange(page)}
                        className={`h-10 w-10 rounded-full font-semibold ${
                            page === currentPage
                                ? 'bg-teal-700 text-white'
                                : 'text-neutral-700 hover:bg-teal-50'
                        }`}
                    >
                        {page}
                    </button>
                ),
            )}

            <button
                type="button"
                aria-label="Next page"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={arrowClass}
            >
                <ChevronRight size={20} />
            </button>
        </nav>
    );
}
