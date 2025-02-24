<!-- CarListingForm.vue -->
<template>
  <div class="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">List Your Car</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <!-- Make -->
        <div>
          <label for="make" class="block text-sm font-medium text-gray-700 mb-1"
            >Make</label
          >
          <input
            id="make"
            v-model="localState.make"
            type="text"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <!-- Model -->
        <div>
          <label
            for="model"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Model</label
          >
          <input
            id="model"
            v-model="localState.model"
            type="text"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Year -->
        <div>
          <label for="year" class="block text-sm font-medium text-gray-700 mb-1"
            >Year</label
          >
          <input
            id="year"
            v-model.number="localState.year"
            type="number"
            min="1900"
            :max="currentYear"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <!-- Price -->
        <div>
          <label
            for="price"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Price ($)</label
          >
          <input
            id="price"
            v-model.number="localState.price"
            type="number"
            min="0"
            step="100"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <!-- Description -->
      <div>
        <label
          for="description"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Description</label
        >
        <textarea
          id="description"
          v-model="localState.description"
          rows="3"
          class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <!-- Contact Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1"
          >Contact Email</label
        >
        <input
          id="email"
          v-model="localState.contactEmail"
          type="email"
          class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div class="flex justify-between pt-2">
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Reset
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Submitting...' : 'List My Car' }}
        </button>
      </div>

      <div
        v-if="successMessage"
        class="mt-2 p-2 bg-green-100 text-green-800 rounded-md"
      >
        {{ successMessage }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import {
  useCarListing,
  type CarListingState,
} from '../composables/useCarListing';

// Emits
const emit = defineEmits<{
  (e: 'submit', data: CarListingState): void;
}>();

// Get the car listing composable
const {
  state,
  setState,
  resetForm: resetComposableForm,
  submitListing,
} = useCarListing();

// Create a local reactive copy of the state
const localState = reactive<CarListingState>({
  make: '',
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  description: '',
  contactEmail: '',
});

// Computed values
const currentYear = computed(() => new Date().getFullYear());
const isSubmitting = ref(false);
const successMessage = ref('');

// Watch for changes from the composable state
watch(
  () => state.value,
  (newState) => {
    console.log('watcher');
    Object.assign(localState, newState);
  },
  { deep: true }
);

// Watch for local changes to update the composable
watch(
  localState,
  (newState) => {
    setState(newState);
  },
  { deep: true }
);

// Form submission handler
const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    const result = await submitListing();

    if (result.success) {
      successMessage.value = 'Your car has been listed successfully!';
      emit('submit', result.data);

      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  } finally {
    isSubmitting.value = false;
  }
};

// Reset form handler
const resetForm = () => {
  resetComposableForm();
  successMessage.value = '';
};
</script>
