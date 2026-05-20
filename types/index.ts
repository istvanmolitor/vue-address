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

export interface City {
  id: number
  country_id: number
  country?: {
    id: number
    code: string
    name: string
  }
  name: string | null
  zip_code: string | null
}

export interface CityListMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface CityPayload {
  country_id: number
  name: string
  zip_code: string | null
}
