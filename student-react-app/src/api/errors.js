/**
 * Turn an Axios error into something the UI can show.
 *
 * Returns { status, title, message, items: [{ field, msg }], fieldErrors: { field: msg } }
 *
 * FastAPI error bodies:
 *   404 -> { "detail": "Student 9 not found" }
 *   409 -> { "detail": "Email x@y.com is already used by student 3" }
 *   422 -> { "detail": [{ "loc": ["body", "email"], "msg": "value is not a valid email" }] }
 */
export function parseApiError(error) {
  const result = {
    status: error.response?.status ?? 0,
    title: 'Request failed',
    message: '',
    items: [],
    fieldErrors: {},
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return { ...result, title: 'Request timed out', message: 'The server took too long to respond. Please try again.' }
  }

  // No response at all (server down), or the Vite proxy could not reach FastAPI (502/504)
  if (!error.response || [502, 503, 504].includes(error.response.status)) {
    return {
      ...result,
      title: 'Cannot reach the API',
      message: 'Make sure the FastAPI server is running: uvicorn app.main:app --reload (in fastapi-mysql-app).',
    }
  }

  const { status } = error.response
  const detail = error.response.data?.detail

  if (Array.isArray(detail)) {
    const items = detail.map(({ loc, msg = 'Invalid value' }) => ({ field: loc?.at(-1) ?? 'field', msg }))
    for (const { field, msg } of items) {
      if (typeof field === 'string') result.fieldErrors[field] = msg
    }
    return { ...result, title: 'Validation error', message: 'Please fix the following:', items }
  }

  if (typeof detail === 'string') {
    if (status === 409) {
      // The only conflict this API reports is a duplicate email
      return { ...result, title: 'Already exists', message: detail, fieldErrors: { email: detail } }
    }
    return { ...result, title: status === 404 ? 'Not found' : `Error ${status}`, message: detail }
  }

  return { ...result, title: `Error ${status}`, message: error.message || 'Unexpected server error.' }
}
