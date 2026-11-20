/** Small helpers about students: avatars, colours, form values, validation. */

/** "Asha Patil" -> "AP" */
export function initials(name = '') {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || '?'
  )
}

/** The same text always gives the same colour hue (0-359). */
export function hueFromString(text = '') {
  let hash = 0
  for (const char of String(text)) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash)
    hash |= 0
  }
  return Math.abs(hash) % 360
}

export const EMPTY_FORM = { name: '', age: '', email: '', course: '' }

/** Student object -> form values (inputs always hold text) */
export function toFormValues(student) {
  if (!student) return EMPTY_FORM
  return { name: student.name, age: String(student.age), email: student.email, course: student.course }
}

/** Form values -> JSON body for the API */
export function toPayload(values) {
  return {
    name: values.name.trim(),
    age: values.age === '' ? null : Number(values.age),
    email: values.email.trim(),
    course: values.course.trim(),
  }
}

/** Only the fields that differ from the original student (for PATCH) */
export function changedFields(data, original) {
  return Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== original[key]))
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Client-side checks that mirror the Pydantic rules in app/schemas/student.py */
export function validateStudent(data) {
  const errors = {}
  if (!data.name) errors.name = 'Name is required.'
  else if (data.name.length > 100) errors.name = 'Name must be 100 characters or fewer.'

  if (data.age === null || Number.isNaN(data.age)) errors.age = 'Age is required.'
  else if (!Number.isInteger(data.age) || data.age < 1 || data.age > 120)
    errors.age = 'Age must be a whole number from 1 to 120.'

  if (!data.email) errors.email = 'Email is required.'
  else if (!EMAIL_RE.test(data.email)) errors.email = 'Enter a valid email address.'

  if (!data.course) errors.course = 'Course is required.'
  else if (data.course.length > 100) errors.course = 'Course must be 100 characters or fewer.'

  return errors
}
