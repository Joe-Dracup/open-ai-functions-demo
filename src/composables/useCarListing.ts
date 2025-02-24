// composables/useCarListing.ts
import { ref, readonly } from 'vue';

export interface CarListingState {
  make: string;
  model: string;
  year: number;
  price: number;
  description: string;
  contactEmail: string;
}

const defaultState: CarListingState = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  description: '',
  contactEmail: '',
};
const state = ref<CarListingState>({ ...defaultState });

export function useCarListing() {
  // Function to set the entire state externally
  const setState = (newState: Partial<CarListingState>) => {
    state.value = { ...state.value, ...newState };

    console.log(state.value);
  };

  // Function to reset the form
  const resetForm = () => {
    state.value = { ...defaultState };
  };

  // Function to submit the form
  const submitListing = async () => {
    // Here you would typically send the data to an API
    console.log('Submitting car listing:', state.value);
    // Example API call:
    // await api.post('/car-listings', state.value)

    return {
      success: true,
      data: { ...state.value },
    };
  };

  return {
    state: readonly(state),
    setState,
    resetForm,
    submitListing,
  };
}
