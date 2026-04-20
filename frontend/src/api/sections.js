import api from './api'

export const updateSectionOrder = (sections) => api.put('/api/sections/order', { sections })
export const updateSectionVisibility = (hidden_sections) => api.put('/api/sections/visibility', { hidden_sections })
export const updateSectionSettings = (section, settings) => api.put('/api/sections/settings', { section, settings })
export const updateProfileExtras = (data) => api.put('/api/sections/extras', data)

export const upsertExperiences    = (items) => api.put('/api/sections/experience', items)
export const upsertEducations     = (items) => api.put('/api/sections/education', items)
export const upsertCertifications = (items) => api.put('/api/sections/certifications', items)
export const upsertServices       = (items) => api.put('/api/sections/services', items)
export const upsertTestimonials   = (items) => api.put('/api/sections/testimonials', items)
export const upsertBooks          = (items) => api.put('/api/sections/books', items)
export const upsertPublications   = (items) => api.put('/api/sections/publications', items)
export const upsertQuotes         = (items) => api.put('/api/sections/quotes', items)
export const upsertCustomSections = (items) => api.put('/api/sections/custom', items)
