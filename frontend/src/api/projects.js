import api from './api'

export const listProjects = () => api.get('/api/projects')
export const createProject = (data) => api.post('/api/projects', data)
export const updateProject = (id, data) => api.put(`/api/projects/${id}`, data)
export const deleteProject = (id) => api.delete(`/api/projects/${id}`)
export const reorderProjects = (items) => api.put('/api/projects/reorder', items)
export const uploadProjectImage = (id, file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post(`/api/projects/${id}/image`, form)
}
