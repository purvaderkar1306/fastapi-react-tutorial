import { useMemo } from 'react'

import { useCountUp } from '../../hooks/useCountUp.js'

/** The four summary cards above the table. */
export default function StudentStats({ students }) {
  const stats = useMemo(() => {
    const counts = {}
    let ageSum = 0
    for (const s of students) {
      ageSum += s.age
      counts[s.course] = (counts[s.course] ?? 0) + 1
    }
    const topCourse = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0]
    return {
      total: students.length,
      averageAge: students.length ? (ageSum / students.length).toFixed(1) : '–',
      courseCount: Object.keys(counts).length,
      topCourse: topCourse ? `${topCourse} (${counts[topCourse]})` : '–',
    }
  }, [students])

  const total = useCountUp(stats.total)
  const courseCount = useCountUp(stats.courseCount)

  return (
    <section className="stats-grid" aria-label="Summary">
      <StatCard label="Total students" value={total} accent="var(--c-primary)" />
      <StatCard label="Average age" value={stats.averageAge} accent="var(--c-success)" />
      <StatCard label="Courses" value={courseCount} accent="var(--c-warning)" />
      <StatCard label="Most popular course" value={stats.topCourse} accent="var(--c-info)" small />
    </section>
  )
}

function StatCard({ label, value, accent, small = false }) {
  return (
    <article className="stat-card" style={{ '--accent': accent }}>
      <span className="stat-label">{label}</span>
      <span className={`stat-value ${small ? 'stat-value-sm' : ''}`} title={small ? String(value) : undefined}>
        {value}
      </span>
    </article>
  )
}
