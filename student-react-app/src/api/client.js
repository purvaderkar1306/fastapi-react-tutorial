import axios from 'axios'

/**
 * One shared Axios instance for every request.
 * baseURL "/api" is forwarded to FastAPI by the Vite proxy (see vite.config.js).
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10000,
  headers: { Accept: 'application/json' },
})
