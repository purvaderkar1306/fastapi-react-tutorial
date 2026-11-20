import { useCallback, useEffect, useState } from 'react'

import { parseApiError } from '../../api/errors.js'
import { studentsApi } from '../../api/students.js'

/** GET /students -> { data, error }. Never throws, so callers don't need try/catch. */
async function fetchStudents() {
  try {
    return { data: await studentsApi.list(), error: null }
  } catch (err) {
    return { data: [], error: parseApiError(err) }
  }
}

/** Loads every student and lets the page reload them. */
export function useStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // First load when the page opens.
  // In development React runs effects twice on purpose (StrictMode); the cleanup
  // marks the first run as inactive so its answer is ignored.
  useEffect(() => {
    let active = true
    fetchStudents().then(({ data, error }) => {
      if (!active) return
      setStudents(data)
      setError(error)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  // Called after add / edit / delete, and by the Reload button
  const reload = useCallback(async () => {
    setLoading(true)
    const { data, error } = await fetchStudents()
    setStudents(data)
    setError(error)
    setLoading(false)
  }, [])

  return { students, loading, error, reload }
}
