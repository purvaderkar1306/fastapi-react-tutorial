import { useEffect, useState } from 'react'

import { healthApi } from '../api/students.js'

const CHECK_EVERY_MS = 30000

/** Checks GET /health/db now and every 30 seconds. status: "checking" | "online" | "offline" */
export function useApiStatus() {
  const [state, setState] = useState({ status: 'checking', mysqlVersion: null })

  useEffect(() => {
    let cancelled = false // ignore answers that arrive after the component is gone

    const check = () =>
      healthApi
        .db()
        .then((data) => !cancelled && setState({ status: 'online', mysqlVersion: data.mysql_version }))
        .catch(() => !cancelled && setState({ status: 'offline', mysqlVersion: null }))

    check()
    const timer = setInterval(check, CHECK_EVERY_MS)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  return state
}
