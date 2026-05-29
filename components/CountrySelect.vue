<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { toastService } from '@admin'
import Icon from '@admin/components/ui/Icon.vue'
import { countryApi } from '../services/countryApi'
import type { Country } from '../types'

interface Props {
  modelValue?: number | null
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Válassz egy országot',
  searchPlaceholder: 'Keresés...',
  emptyMessage: 'Nincs találat.',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const search = ref('')
const isOpen = ref(false)
const isLoading = ref(true)
const countries = ref<Country[]>([])

const displayedCountries = computed(() => {
  if (!search.value) return countries.value
  const q = search.value.toLowerCase()
  return countries.value.filter(
    country =>
      String(country.name ?? '').toLowerCase().includes(q) ||
      String(country.code ?? '').toLowerCase().includes(q)
  )
})

const selectedCountry = computed(() => {
  return countries.value.find(c => c.id === props.modelValue)
})

const selectedLabel = computed(() => {
  return selectedCountry.value?.name || selectedCountry.value?.code || 'Nincs kiválasztva'
})

const fetchCountries = async (): Promise<void> => {
  try {
    isLoading.value = true
    const response = await countryApi.list({ per_page: 999 })
    countries.value = response.data ?? []
  } catch (error) {
    console.error('Hiba az országok betöltésekor:', error)
    toastService.error('Hiba történt az országok betöltése során.')
  } finally {
    isLoading.value = false
  }
}

const selectCountry = (country: Country) => {
  emit('update:modelValue', country.id)
  isOpen.value = false
  search.value = ''
}

onMounted(() => {
  fetchCountries()
})
</script>

<template>
  <div class="relative">
    <button
      type="button"
      :id="props.id"
      :disabled="disabled || isLoading"
      class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="isOpen = !isOpen"
    >
       <span :class="modelValue ? 'text-foreground' : 'text-muted-foreground'">
         {{ modelValue ? selectedLabel : placeholder }}
       </span>
       <Icon name="chevron-down" class="h-4 w-4 opacity-50 ml-2 shrink-0" />
    </button>

    <div
      v-if="isOpen && !isLoading"
      class="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md"
    >
      <div class="p-2">
        <input
          v-model="search"
          type="text"
          autofocus
          class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          :placeholder="searchPlaceholder"
        />
      </div>
      <div class="max-h-96 overflow-y-auto p-1">
        <div v-if="displayedCountries.length === 0" class="py-2 px-3 text-sm text-muted-foreground">
          {{ emptyMessage }}
        </div>
        <button
          v-for="country in displayedCountries"
          :key="country.id"
          type="button"
          class="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          :class="{ 'bg-accent text-accent-foreground': modelValue === country.id }"
          @click="selectCountry(country)"
          @keydown.enter="selectCountry(country)"
        >
           <span>{{ country.name || country.code }}</span>
           <Icon v-if="modelValue === country.id" name="check" class="h-4 w-4 shrink-0" />
        </button>
      </div>
    </div>

    <div v-if="isOpen && !isLoading" class="fixed inset-0 z-40" @click="isOpen = false" />
  </div>
</template>



