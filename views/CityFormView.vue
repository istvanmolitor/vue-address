<script setup lang="ts">
import { AdminLayout, BackButton, FormButtons, Input, InputError, Label, toastService, LoadingSpinner } from '@admin'
import InputField from '@admin/components/ui/InputField.vue'
import Checkbox from '@admin/components/ui/Checkbox.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import CountrySelect from '../components/CountrySelect.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cityApi } from '../services/cityApi'
import type { City, CityPayload } from '../types'

const router = useRouter()
const route = useRoute()
const isLoading = ref(true)
const isSaving = ref(false)
const errors = ref<Record<string, string[]>>({})

const form = reactive<CityPayload>({
  is_valid: false,
  country_id: 0,
  name: '',
  zip_code: null,
})

const isEditing = computed(() => Boolean(route.params.id))
const cityId = computed(() => Number(route.params.id))
const zipCodeModel = computed({
  get: () => form.zip_code ?? '',
  set: (value: string | number) => {
    const normalizedValue = String(value).trim()
    form.zip_code = normalizedValue === '' ? null : normalizedValue
  },
})

const fetchFormData = async (): Promise<void> => {
  try {
    isLoading.value = true


    if (isEditing.value) {
      const response = await cityApi.edit(cityId.value)
      const city: City = response.data

      form.is_valid = Boolean(city.is_valid)
      form.country_id = city.country_id ?? 0
      form.name = city.name ?? ''
      form.zip_code = city.zip_code ?? null
    } else {
      await cityApi.create()
    }
  } catch (error) {
    console.error('Hiba a város adatainak betöltésekor:', error)
    toastService.error('Hiba történt az adatok betöltése során.')
    await router.push('/admin/cities')
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async (): Promise<void> => {
  try {
    isSaving.value = true
    errors.value = {}

    const payload: CityPayload = {
      is_valid: form.is_valid,
      country_id: form.country_id,
      name: form.name,
      zip_code: form.zip_code,
    }

    if (isEditing.value) {
      await cityApi.update(cityId.value, payload)
      toastService.success('Város sikeresen frissítve!')
      await router.push('/admin/cities')
      return
    }

    const response = await cityApi.store(payload)
    toastService.success('Város sikeresen létrehozva!')

    const createdCityId = response?.data?.id
    if (createdCityId) {
      await router.push(`/admin/cities/${createdCityId}/edit`)
      return
    }

    await router.push('/admin/cities')
  } catch (error: any) {
    console.error('Hiba a város mentésekor:', error)

    if (error.response?.status === 422) {
      errors.value = error.response.data.errors ?? {}
      toastService.error('Kérjük, javítsd a hibaüzeneteket.')
    } else {
      toastService.error('Hiba történt a mentés során.')
    }
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchFormData()
})
</script>

<template>
  <AdminLayout :page-title="isEditing ? 'Város szerkesztése' : 'Új város'">
    <div class="mb-4 flex items-center justify-between space-y-2">
      <BackButton to="/admin/cities" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8"><LoadingSpinner label="Betöltés..." /></div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Város adatok</CardTitle>
        <CardDescription>
          Add meg a város adatait.
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="country_id">Ország</Label>
          <CountrySelect
            id="country_id"
            v-model.number="form.country_id"
            placeholder="Válassz egy országot"
          />
          <InputError :message="errors.country_id" />
        </div>

        <InputField id="name" label="Város neve" v-model="form.name" placeholder="Budapest" :errors="errors.name" />

        <InputField id="zip_code" label="Irányítószám" v-model="zipCodeModel" placeholder="1011" :errors="errors.zip_code" />

        <div class="flex items-center gap-2">
          <Checkbox id="is_valid" v-model="form.is_valid" />
          <Label for="is_valid">Ellenörzött</Label>
        </div>
      </CardContent>

      <CardFooter>
        <FormButtons
          :is-saving="isSaving"
          :save-label="isEditing ? 'Frissítés' : 'Létrehozás'"
          @save="handleSubmit"
          @cancel="router.push('/admin/cities')"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>

