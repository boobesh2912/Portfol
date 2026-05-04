import api from './api'

export const createCheckout = async () => {
  try {
    const data = await api.post('/api/billing/checkout')
    if (data?.checkout_url) {
      window.location.href = data.checkout_url
    } else {
      throw new Error('No checkout URL received')
    }
  } catch (error) {
    console.error('Checkout error:', error)
    throw error
  }
}

export const openPortal = async () => {
  try {
    const data = await api.post('/api/billing/portal')
    if (data?.portal_url) {
      window.open(data.portal_url, '_blank')
    } else {
      throw new Error('No portal URL received')
    }
  } catch (error) {
    console.error('Portal error:', error)
    throw error
  }
}
