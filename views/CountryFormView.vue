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
import { normalizeTranslations } from '@language'
import TranslationRepeaterVue from '@language/components/TranslationRepeater.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { countryApi } from '../services/countryApi'
import type { CountryPayload } from '../types'

const TranslationRepeater = TranslationRepeaterVue as any

const router = useRouter()
const route = useRoute()
const isLoading = ref(true)
const isSaving = ref(false)
const errors = ref<Record<string, string[]>>({})

const form = reactive<CountryPayload>({
  code: '',
  translations: {},
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
      form.is_default = Boolean(country.is_default)
      form.translations = normalizeTranslations(country.translations, ['name'])
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
      translations: form.translations,
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

    <div v-if="isLoading" class="flex justify-center py-8"><LoadingSpinner label="Betöltés..." /></div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Ország adatok</CardTitle>
        <CardDescription>
          Add meg az ország adatait.
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <InputField id="code" label="Kód" v-model="form.code" placeholder="HU" :errors="errors.code" />

        <div class="flex items-center gap-2">
          <Checkbox id="is_default" v-model="form.is_default" />
          <Label for="is_default">Alapértelmezett ország</Label>
        </div>

        <div class="space-y-4 border-t pt-4">
          <h3 class="text-lg font-medium">Fordítások</h3>
          <TranslationRepeater v-model="form.translations" :fields="['name']">
            <template #default="{ language, translation }">
              <div class="space-y-2">
                <Label :for="`translation-name-${language.id}`">Név</Label>
                <Input :id="`translation-name-${language.id}`" v-model="translation.name" placeholder="Magyarország" />
                <InputError :message="errors[`translations.${language.id}.name`]" />
              </div>
            </template>
          </TranslationRepeater>
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
