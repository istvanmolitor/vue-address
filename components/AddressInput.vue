<script setup lang="ts">
import { Input, InputError, Label, Textarea } from '@admin'
import { computed } from 'vue'
import CountrySelect from './CountrySelect.vue'
import type { AddressFormData } from '../types'

interface Props {
  modelValue: AddressFormData
  title?: string
  countryPlaceholder?: string
  errors?: Record<string, string[] | undefined>
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Cim',
  countryPlaceholder: 'Valassz egy orszagot',
  errors: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: AddressFormData): void
}>()

const updateField = <K extends keyof AddressFormData>(key: K, value: AddressFormData[K]): void => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value,
  })
}

const name = computed({
  get: () => props.modelValue.name,
  set: (value: string) => {
    updateField('name', value)
  },
})

const countryId = computed({
  get: () => props.modelValue.country_id,
  set: (value: number | null) => {
    updateField('country_id', value)
  },
})

const zipCode = computed({
  get: () => props.modelValue.zip_code,
  set: (value: string) => {
    updateField('zip_code', value)
  },
})

const city = computed({
  get: () => props.modelValue.city,
  set: (value: string) => {
    updateField('city', value)
  },
})

const address = computed({
  get: () => props.modelValue.address,
  set: (value: string) => {
    updateField('address', value)
  },
})
</script>

<template>
  <div class="space-y-4 rounded-md border p-4">
    <h3 class="text-sm font-medium">{{ title }}</h3>

    <div class="space-y-2">
      <Label>Nev</Label>
      <Input v-model="name" placeholder="Cimzett neve" />
      <InputError :message="props.errors.name" />
    </div>

    <div class="space-y-2">
      <Label>Orszag</Label>
      <CountrySelect v-model="countryId" :placeholder="countryPlaceholder" />
      <InputError :message="props.errors.country_id" />
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <Label>Irsz</Label>
        <Input v-model="zipCode" placeholder="1111" />
        <InputError :message="props.errors.zip_code" />
      </div>

      <div class="space-y-2">
        <Label>Varos</Label>
        <Input v-model="city" placeholder="Budapest" />
        <InputError :message="props.errors.city" />
      </div>
    </div>

    <div class="space-y-2">
      <Label>Cim</Label>
      <Textarea v-model="address" placeholder="Utca, hazszam, emelet, ajto" />
      <InputError :message="props.errors.address" />
    </div>
  </div>
</template>

