<script setup lang="ts">
import { AdminLayout, toastService } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { countryApi } from '../services/countryApi'
import type { Country } from '../types'

const router = useRouter()
const countries = ref<Country[]>([])
const isLoading = ref(false)
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
})

const columns: Column<Country>[] = [
  { key: 'name', label: 'Név', sortable: false },
  { key: 'code', label: 'Kód', sortable: true, width: '140px' },
  { key: 'is_default', label: 'Alapértelmezett', sortable: true, width: '160px' },
]

const fetchCountries = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
}) => {
  try {
    isLoading.value = true
    const response = await countryApi.list(params)
    countries.value = response.data ?? []
    pagination.value = response.meta
  } catch (error) {
    console.error('Hiba az országok betöltésekor:', error)
    toastService.error('Hiba történt az országok betöltése során.')
  } finally {
    isLoading.value = false
  }
}

const deleteCountry = async (id: number): Promise<void> => {
  try {
    await countryApi.delete(id)
    toastService.success('Ország sikeresen törölve!')
    await fetchCountries({ page: Number(pagination.value.current_page) })
  } catch (error) {
    console.error('Hiba az ország törlésekor:', error)
    toastService.error('Hiba történt a törlés során.')
  }
}

const editCountry = (id: number): void => {
  router.push(`/admin/countries/${id}/edit`)
}

onMounted(() => {
  fetchCountries({
    page: 1,
    sort: 'code',
    direction: 'asc',
  })
})
</script>

<template>
  <AdminLayout pageTitle="Országok">
    <DataTable
      :columns="columns"
      :data="countries"
      :loading="isLoading"
      :pagination="pagination"
      :searchable="true"
      search-placeholder="Keresés név vagy kód alapján..."
      default-sort="code"
      default-direction="asc"
      @fetch="fetchCountries"
    >
      <template #actions>
        <CreateButton to="/admin/countries/create">
          Új ország
        </CreateButton>
      </template>

      <template #cell-name="{ row }">
        {{ row.name || '-' }}
      </template>

      <template #cell-is_default="{ row }">
        <span v-if="row.is_default" class="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
          Igen
        </span>
        <span v-else class="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
          Nem
        </span>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="editCountry(row.id)" />
        <DeleteButton @confirm="deleteCountry(row.id)" />
      </template>

      <template #empty>
        Nincs megjeleníthető ország.
      </template>
    </DataTable>
  </AdminLayout>
</template>

