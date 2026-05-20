<script setup lang="ts">
import {
  AdminLayout,
  BackButton,
  FormButtons,
  Input,
  InputError,
  Label,
  toastService,
} from '@admin'
import Checkbox from '@admin/components/ui/Checkbox.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { countryApi } from '../services/countryApi'
import type { CountryPayload } from '../types'

const router = useRouter()
const route = useRoute()
const isLoading = ref(true)
const isSaving = ref(false)
const errors = ref<Record<string, string[]>>({})

const form = reactive<CountryPayload>({
  code: '',
  name: '',
  is_default: false,
})

const isEditing = computed(() => Boolean(route.params.id))
const countryId = computed(() => Number(route.params.id))

const fetchFormData = async (): Promise<void> => {
  try {
    isLoading.value = true

    if (isEditing.value) {
      const response = await countryApi.edit(countryId.value)
      const country = response.data

      form.code = country.code ?? ''
      form.name = country.name ?? ''
      form.is_default = Boolean(country.is_default)
    } else {
      await countryApi.create()
    }
  } catch (error) {
    console.error('Hiba az ország adatainak betöltésekor:', error)
    toastService.error('Hiba történt az adatok betöltése során.')
    await router.push('/admin/countries')
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async (): Promise<void> => {
  try {
    isSaving.value = true
    errors.value = {}

    const payload: CountryPayload = {
      code: form.code,
      name: form.name,
      is_default: form.is_default,
    }

    if (isEditing.value) {
      await countryApi.update(countryId.value, payload)
      toastService.success('Ország sikeresen frissítve!')
      await router.push('/admin/countries')
      return
    }

    const response = await countryApi.store(payload)
    toastService.success('Ország sikeresen létrehozva!')

    const createdCountryId = response?.data?.id
    if (createdCountryId) {
      await router.push(`/admin/countries/${createdCountryId}/edit`)
      return
    }

    await router.push('/admin/countries')
  } catch (error: any) {
    console.error('Hiba az ország mentésekor:', error)

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
  <AdminLayout :page-title="isEditing ? 'Ország szerkesztése' : 'Új ország'">
    <div class="mb-4 flex items-center justify-between space-y-2">
      <BackButton to="/admin/countries" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      Betöltés...
    </div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Ország adatok</CardTitle>
        <CardDescription>
          Add meg az ország adatait.
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Név</Label>
          <Input id="name" v-model="form.name" placeholder="Magyarország" />
          <InputError :message="errors.name" />
        </div>

        <div class="space-y-2">
          <Label for="code">Kód</Label>
          <Input id="code" v-model="form.code" placeholder="HU" />
          <InputError :message="errors.code" />
        </div>

        <div class="flex items-center gap-2">
          <Checkbox id="is_default" v-model="form.is_default" />
          <Label for="is_default">Alapértelmezett ország</Label>
        </div>
      </CardContent>

      <CardFooter>
        <FormButtons
          :is-saving="isSaving"
          :save-label="isEditing ? 'Frissítés' : 'Létrehozás'"
          @save="handleSubmit"
          @cancel="router.push('/admin/countries')"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>

