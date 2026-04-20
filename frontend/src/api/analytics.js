import api from './api'

export const recordView = (username, referrer) =>
  api.post('/api/analytics/view', { username, referrer }).catch(() => {})

export const getMyAnalytics = () => api.get('/api/analytics/me')
