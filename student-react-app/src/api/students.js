import { api } from './client.js'

/**
 * Every call to the /students endpoints of fastapi-mysql-app.
 * Each function returns a Promise that resolves to the JSON body.
 */
export const studentsApi = {
  list: (skip = 0, limit = 1000) =>
    api.get('/students', { params: { skip, limit } }).then((res) => res.data),

  get: (id) => api.get(`/students/${id}`).then((res) => res.data),

  create: (student) => api.post('/students', student).then((res) => res.data),

  replace: (id, student) => api.put(`/students/${id}`, student).then((res) => res.data),

  update: (id, changes) => api.patch(`/students/${id}`, changes).then((res) => res.data),

  remove: (id) => api.delete(`/students/${id}`), // 204 No Content: nothing to return
}

export const healthApi = {
  db: () => api.get('/health/db').then((res) => res.data),
}
