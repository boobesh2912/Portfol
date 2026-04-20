import api from './api'

export const connectDomain = (domain) => api.post('/api/domain/connect', { domain })
export const verifyDomain = () => api.get('/api/domain/verify')
export const removeDomain = () => api.delete('/api/domain')
