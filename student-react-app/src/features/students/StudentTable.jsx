import Avatar from '../../components/ui/Avatar.jsx'
import CourseBadge from '../../components/ui/CourseBadge.jsx'
import Icon from '../../components/ui/Icon.jsx'

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
  { key: 'email', label: 'Email', className: 'hide-md' },
  { key: 'course', label: 'Course', className: 'hide-sm' },
]

/** The students table with sortable headings and View / Edit / Delete buttons. */
export default function StudentTable({ students, loading, sortKey, sortDir, onSort, highlightId, onView, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={['sortable', col.className, sortKey === col.key && sortDir].filter(Boolean).join(' ')}
                onClick={() => onSort(col.key)}
                aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                {col.label}
              </th>
            ))}
            <th className="text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {!loading &&
            students.map((s, index) => (
              <tr
                key={s.id}
                className={s.id === highlightId ? 'flash' : undefined}
                style={{ '--i': index }}
                onDoubleClick={() => onView(s.id)}
              >
                <td className="muted">#{s.id}</td>
                <td>
                  <div className="cell-name">
                    <Avatar name={s.name} />
                    <span>
                      {s.name}
                      <small className="show-md">{s.email}</small>
                    </span>
                  </div>
                </td>
                <td>{s.age}</td>
                <td className="hide-md">{s.email}</td>
                <td className="hide-sm">
                  <CourseBadge course={s.course} />
                </td>
                <td className="actions">
                  <ActionButton kind="view" label="View" onClick={() => onView(s.id)} />
                  <ActionButton kind="edit" label="Edit" onClick={() => onEdit(s)} />
                  <ActionButton kind="delete" label="Delete" onClick={() => onDelete(s)} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {loading && (
        <div className="table-state">
          <span className="spinner" />
          <span>Loading students…</span>
        </div>
      )}

      {!loading && students.length === 0 && (
        <div className="table-state">
          <Icon name="users" className="icon-xl" />
          <span>No students found.</span>
        </div>
      )}
    </div>
  )
}

function ActionButton({ kind, label, onClick }) {
  return (
    <button type="button" className={`action-btn ${kind}`} onClick={onClick} title={label} aria-label={label}>
      <Icon name={kind} />
    </button>
  )
}
