import { createApiClient } from '@user'
import type { CountryPayload } from '../types'

const api = createApiClient({ baseURL: '/api/admin/address' })

interface ListParams {
  page?: number
  search?: string
  sort?: string
  direction?: string
}

export const countryApi = {
  async list(params: ListParams = {}) {
    const response = await api.get('/countries', { params })
    return response.data
  },

  async create() {
    const response = await api.get('/countries/create')
    return response.data
  },

  async store(data: CountryPayload) {
    const response = await api.post('/countries', data)
    return response.data
  },

  async show(id: number) {
    const response = await api.get(`/countries/${id}`)
    return response.data
  },

  async edit(id: number) {
    const response = await api.get(`/countries/${id}/edit`)
    return response.data
  },

  async update(id: number, data: CountryPayload) {
    const response = await api.put(`/countries/${id}`, data)
    return response.data
  },

  async delete(id: number) {
    const response = await api.delete(`/countries/${id}`)
    return response.data
  },
}

