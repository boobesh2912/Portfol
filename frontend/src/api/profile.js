import api from './api'

export const getPublicProfile = (username) => api.get(`/api/profile/${username}`)
export const getMyProfile = () => api.get('/api/profile/me/data')
export const updateProfile = (data) => api.put('/api/profile/me', data)
export const uploadAvatar = (file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/api/profile/me/avatar', form)
}
export const deleteAccount = () => api.delete('/api/profile/me')
export const checkUsername = (username) => api.get(`/api/profile/check-username?username=${encodeURIComponent(username)}`)
export const updateUsername = (username) => api.patch('/api/profile/me/username', { username })
