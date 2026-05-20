import type { RouteRecordRaw } from 'vue-router'
import CountryListView from './views/CountryListView.vue'
import CountryFormView from './views/CountryFormView.vue'

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
]

