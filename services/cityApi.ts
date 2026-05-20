import { createApiClient } from '@user'
import type { CityPayload } from '../types'

const api = createApiClient({ baseURL: '/api/admin/address' })

interface ListParams {
  page?: number
  search?: string
  sort?: string
  direction?: string
}

export const cityApi = {
  async list(params: ListParams = {}) {
    const response = await api.get('/cities', { params })
    return response.data
  },

  async create() {
    const response = await api.get('/cities/create')
    return response.data
  },

  async store(data: CityPayload) {
    const response = await api.post('/cities', data)
    return response.data
  },

  async show(id: number) {
    const response = await api.get(`/cities/${id}`)
    return response.data
  },

  async edit(id: number) {
    const response = await api.get(`/cities/${id}/edit`)
    return response.data
  },

  async update(id: number, data: CityPayload) {
    const response = await api.put(`/cities/${id}`, data)
    return response.data
  },

  async delete(id: number) {
    const response = await api.delete(`/cities/${id}`)
    return response.data
  },
}

