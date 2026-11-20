import { useEffect, useMemo, useRef, useState } from 'react'

import { parseApiError } from '../../api/errors.js'
import { studentsApi } from '../../api/students.js'
import Icon from '../../components/ui/Icon.jsx'
import Pagination from '../../components/ui/Pagination.jsx'
import { useDialog } from '../../hooks/useDialog.js'
import { useDebounce } from '../../hooks/useDebounce.js'
import StudentFormModal from './StudentFormModal.jsx'
import StudentStats from './StudentStats.jsx'
import StudentTable from './StudentTable.jsx'
import StudentToolbar from './StudentToolbar.jsx'
import StudentViewModal from './StudentViewModal.jsx'
import { useStudents } from './useStudents.js'

const CLOSE_ANIMATION_MS = 260

export default function StudentsPage() {
  const dialog = useDialog()
  const { students, loading, error, reload } = useStudents()

  // ---- what the user has chosen ----
  const [search, setSearch] = useState('')
  const [course, setCourse] = useState('')
  const [sort, setSort] = useState({ key: 'id', dir: 'asc' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [highlightId, setHighlightId] = useState(null)

  // ---- modals ----
  // `key` changes every time the form opens, so React creates a fresh form (empty or pre-filled)
  const [form, setForm] = useState({ open: false, student: null, key: 0 })
  const [view, setView] = useState({ open: false, student: null })

  const searchRef = useRef(null)
  const debouncedSearch = useDebounce(search.trim().toLowerCase(), 250)

  // Show an error dialog whenever loading fails
  useEffect(() => {
    if (error) dialog.error(error.title, error.message)
  }, [error, dialog])

  // ---- derived data (recalculated only when its inputs change) ----
  const courses = useMemo(
    () => [...new Set(students.map((s) => s.course))].sort((a, b) => a.localeCompare(b)),
    [students],
  )

  // A course that no longer exists (its last student was deleted) can't stay selected
  const selectedCourse = courses.includes(course) ? course : ''

  const visible = useMemo(() => {
    const q = debouncedSearch
    const filtered = students.filter((s) => {
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q) ||
        String(s.id) === q
      const matchesCourse = !selectedCourse || s.course === selectedCourse
      return matchesSearch && matchesCourse
    })

    const dir = sort.dir === 'asc' ? 1 : -1
    return filtered.sort((a, b) => {
      const x = a[sort.key]
      const y = b[sort.key]
      return (typeof x === 'string' ? x.localeCompare(y) : x - y) * dir
    })
  }, [students, debouncedSearch, selectedCourse, sort])

  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const pageItems = visible.slice(start, start + pageSize)

  // ---- keyboard shortcuts: "/" = search, "n" = new student ----
  useEffect(() => {
    const onKeyDown = (e) => {
      const typing = ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)
      if (typing || document.body.classList.contains('modal-open')) return
      if (e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (e.key === 'n') {
        e.preventDefault()
        openForm(null)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  // ---- actions ----
  function openForm(student) {
    setForm((f) => ({ open: true, student, key: f.key + 1 }))
  }

  const closeForm = () => setForm((f) => ({ ...f, open: false }))

  async function handleSaved(saved, isEdit) {
    closeForm()
    await reload()
    setHighlightId(saved.id)
    setTimeout(() => setHighlightId(null), 1500)
    dialog.success(
      isEdit ? 'Student updated' : 'Student created',
      <>
        <strong>{saved.name}</strong> (ID #{saved.id}) was {isEdit ? 'updated' : 'added'} successfully.
      </>,
    )
  }

  async function openView(id) {
    try {
      const student = await studentsApi.get(id) // fresh copy from GET /students/{id}
      setView({ open: true, student })
    } catch (err) {
      const problem = parseApiError(err)
      dialog.error(problem.title, problem.message)
      if (problem.status === 404) reload()
    }
  }

  function editFromView(student) {
    setView((v) => ({ ...v, open: false }))
    setTimeout(() => openForm(students.find((s) => s.id === student.id) ?? student), CLOSE_ANIMATION_MS)
  }

  async function confirmDelete(student) {
    const yes = await dialog.confirm({
      title: 'Delete student?',
      message: (
        <>
          This will permanently remove <strong>{student.name}</strong> (ID #{student.id}). This cannot be undone.
        </>
      ),
      okText: 'Delete',
      danger: true,
    })
    if (!yes) return

    try {
      await studentsApi.remove(student.id)
      await reload()
      dialog.success(
        'Deleted',
        <>
          <strong>{student.name}</strong> was removed.
        </>,
      )
    } catch (err) {
      const problem = parseApiError(err)
      dialog.error(problem.title, problem.message)
    }
  }

  function handleSort(key) {
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))
  }

  // Every filter change goes back to page 1
  const resetPage = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  return (
    <>
      <section className="page-head">
        <div>
          <h1>Students</h1>
          <p className="muted">Stored in MySQL through the FastAPI backend.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => openForm(null)}>
          <Icon name="plus" />
          Add Student
        </button>
      </section>

      <StudentStats students={students} />

      <section className="card">
        <StudentToolbar
          searchRef={searchRef}
          search={search}
          onSearchChange={resetPage(setSearch)}
          courses={courses}
          course={selectedCourse}
          onCourseChange={resetPage(setCourse)}
          pageSize={pageSize}
          onPageSizeChange={resetPage(setPageSize)}
          onReload={reload}
        />

        <StudentTable
          students={pageItems}
          loading={loading}
          sortKey={sort.key}
          sortDir={sort.dir}
          onSort={handleSort}
          highlightId={highlightId}
          onView={openView}
          onEdit={openForm}
          onDelete={confirmDelete}
        />

        <div className="table-footer">
          <span className="muted">
            {visible.length > 0 && `Showing ${start + 1}–${start + pageItems.length} of ${visible.length}`}
          </span>
          <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
        </div>
      </section>

      <StudentFormModal
        key={form.key}
        open={form.open}
        student={form.student}
        courses={courses}
        onClose={closeForm}
        onSaved={handleSaved}
      />

      <StudentViewModal
        open={view.open}
        student={view.student}
        onClose={() => setView((v) => ({ ...v, open: false }))}
        onEdit={editFromView}
      />
    </>
  )
}
