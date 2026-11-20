import { hueFromString } from '../../utils/student.js'

export default function CourseBadge({ course }) {
  return (
    <span className="badge" style={{ '--hue': hueFromString(course) }}>
      {course}
    </span>
  )
}
