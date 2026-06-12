import api from './axios.js'

export const getLinkAnalytics = (id, days = 7) => api.get(`/analytics/link/${id}?days=${days}`)
export const getPublicStats = (shortCode) => api.get(`/stats/${shortCode}`)
export const getGlobalAnalytics = () => api.get('/analytics/global')
export const exportAnalyticsCSV = (id) => api.get(`/analytics/export/${id}/csv`, { responseType: 'blob' })