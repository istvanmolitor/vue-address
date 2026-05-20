<script setup lang="ts">
import { AdminLayout, toastService } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { cityApi } from '../services/cityApi'
import { countryApi } from '../services/countryApi'
import type { City } from '../types'

const router = useRouter()
const cities = ref<City[]>([])
const isLoading = ref(false)
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
})

const columns: Column<City>[] = [
  { key: 'country', label: 'Ország', sortable: false },
  { key: 'name', label: 'Város', sortable: true },
  { key: 'zip_code', label: 'Irányítószám', sortable: true, width: '140px' },
]

const fetchCities = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
}) => {
  try {
    isLoading.value = true
    const response = await cityApi.list(params)
    cities.value = response.data ?? []
    pagination.value = response.meta
  } catch (error) {
    console.error('Hiba a városok betöltésekor:', error)
    toastService.error('Hiba történt a városok betöltése során.')
  } finally {
    isLoading.value = false
  }
}

const deleteCity = async (id: number): Promise<void> => {
  try {
    await cityApi.delete(id)
    toastService.success('Város sikeresen törölve!')
    await fetchCities({ page: Number(pagination.value.current_page) })
  } catch (error) {
    console.error('Hiba a város törlésekor:', error)
    toastService.error('Hiba történt a törlés során.')
  }
}

const editCity = (id: number): void => {
  router.push(`/admin/cities/${id}/edit`)
}

onMounted(() => {
  fetchCities({
    page: 1,
    sort: 'name',
    direction: 'asc',
  })
})
</script>

<template>
  <AdminLayout pageTitle="Városok">
    <DataTable
      :columns="columns"
      :data="cities"
      :loading="isLoading"
      :pagination="pagination"
      :searchable="true"
      search-placeholder="Keresés város neve vagy irányítószám alapján..."
      default-sort="name"
      default-direction="asc"
      @fetch="fetchCities"
    >
      <template #actions>
        <CreateButton to="/admin/cities/create">
          Új város
        </CreateButton>
      </template>

      <template #cell-country="{ row }">
        {{ row.country?.name || '-' }}
      </template>

      <template #cell-zip_code="{ row }">
        {{ row.zip_code || '-' }}
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editCity(row.id)" />
        <DeleteButton @confirm="deleteCity(row.id)" />
      </template>

      <template #empty>
        Nincs megjeleníthető város.
      </template>
    </DataTable>
  </AdminLayout>
</template>

