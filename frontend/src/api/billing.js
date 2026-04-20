import api from './api'

export const createCheckout = async () => {
  const data = await api.post('/api/billing/checkout')
  if (data?.checkout_url) window.location.href = data.checkout_url
}

export const openPortal = async () => {
  const data = await api.post('/api/billing/portal')
  if (data?.portal_url) window.location.href = data.portal_url
}
