import Icon from '../../components/ui/Icon.jsx'

/** Search box, course filter, rows-per-page and reload button. */
export default function StudentToolbar({
  searchRef,
  search,
  onSearchChange,
  courses,
  course,
  onCourseChange,
  pageSize,
  onPageSizeChange,
  onReload,
}) {
  return (
    <div className="toolbar">
      <div className="search-box">
        <Icon name="search" />
        <input
          ref={searchRef}
          type="search"
          placeholder="Search by name, email or course…  (press /)"
          autoComplete="off"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search students"
        />
      </div>

      <div className="toolbar-right">
        <select
          className="select"
          value={course}
          onChange={(e) => onCourseChange(e.target.value)}
          aria-label="Filter by course"
        >
          <option value="">All courses</option>
          {courses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          aria-label="Rows per page"
        >
          {[5, 10, 25, 50].map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>

        <button type="button" className="btn btn-icon btn-outline" onClick={onReload} aria-label="Reload students" title="Reload">
          <Icon name="refresh" />
        </button>
      </div>
    </div>
  )
}
