export interface Country {
  id: number
  code: string
  name: string | null
  is_default: boolean
  created_at: string | null
  updated_at: string | null
}

export interface CountryListMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface CountryPayload {
  code: string
  name: string
  is_default: boolean
}

