import api from './api'

export const upsertSkills = (skills) =>
  api.put('/api/skills', skills.map((name, i) => ({ name, order_index: i })))

export const upsertSocialLinks = (links) =>
  api.put('/api/skills/social', links.filter(l => l.url))
