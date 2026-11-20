/** Page buttons: ‹ 1 … 4 5 6 … 12 › */
export default function Pagination({ page, totalPages, onChange }) {
  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i)
    else if (pages.at(-1) !== '…') pages.push('…')
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="page-btn"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        ‹
      </button>

      {pages.map((n, index) =>
        n === '…' ? (
          <span key={`gap-${index}`} className="page-btn" aria-hidden="true" style={{ border: 0, background: 'none' }}>
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            className={`page-btn ${n === page ? 'active' : ''}`}
            aria-current={n === page ? 'page' : undefined}
            aria-label={`Page ${n}`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ),
      )}

      <button
        type="button"
        className="page-btn"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  )
}
