import type { RouteRecordRaw } from 'vue-router'
import CountryListView from './views/CountryListView.vue'
import CountryFormView from './views/CountryFormView.vue'
import CityListView from './views/CityListView.vue'
import CityFormView from './views/CityFormView.vue'

export const addressRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/countries',
    name: 'address.countries',
    component: CountryListView,
  },
  {
    path: '/admin/countries/create',
    name: 'address.countries.create',
    component: CountryFormView,
  },
  {
    path: '/admin/countries/:id/edit',
    name: 'address.countries.edit',
    component: CountryFormView,
  },
  {
    path: '/admin/cities',
    name: 'address.cities',
    component: CityListView,
  },
  {
    path: '/admin/cities/create',
    name: 'address.cities.create',
    component: CityFormView,
  },
  {
    path: '/admin/cities/:id/edit',
    name: 'address.cities.edit',
    component: CityFormView,
  },
]

