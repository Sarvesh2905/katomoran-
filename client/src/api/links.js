import api from './axios.js'

export const createLink = (data) => api.post('/links', data)
export const getLinks = (params) => api.get('/links', { params })
export const getLink = (id) => api.get(`/links/${id}`)
export const updateLink = (id, data) => api.patch(`/links/${id}`, data)
export const deleteLink = (id) => api.delete(`/links/${id}`)
export const bulkCreate = (formData) => api.post('/links/bulk', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const bulkUpload = bulkCreate // alias for backward compat