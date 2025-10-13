import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function CustomPagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const prevDisabled = currentPage === 1;
  const nextDisabled = currentPage === totalPages;

  return (
    <Pagination>
      <PaginationContent className="text-neutral-500">
        <PaginationItem>
          <PaginationPrevious
            className={`w-1 ${
              prevDisabled
                ? "opacity-50 pointer-events-none"
                : "bg-muted/50 hover:bg-blue-100"
            }`}
            href="#"
            onClick={(e: any) => {
              e.preventDefault();
              if (!prevDisabled) onPageChange(currentPage - 1);
            }}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => {
          const page = i + 1;
          const active = page === currentPage;
          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                className={`
                  ${
                    active
                      ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                      : "text-neutral-500 hover:bg-blue-50"
                  }
                  `}
                aria-current={active ? "page" : undefined}
                onClick={(e: any) => {
                  e.preventDefault();
                  if (!active) onPageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationNext
          className={`w-1 ${
            nextDisabled
              ? "opacity-50 pointer-events-none"
              : "bg-muted/50 hover:bg-blue-100"
          }`}
          href="#"
          onClick={(e: any) => {
            e.preventDefault();
            if (!nextDisabled) onPageChange(currentPage - 1);
          }}
        />
      </PaginationContent>
    </Pagination>
  );
}
