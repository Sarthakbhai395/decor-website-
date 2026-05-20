import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface City {
  name: string;
  slug: string;
}

interface CityState {
  selectedCity: City | null;
  setSelectedCity: (city: City) => void;
  clearCity: () => void;
}

export const useCityStore = create<CityState>()(
  persist(
    (set) => ({
      selectedCity: null,
      setSelectedCity: (city) => set({ selectedCity: city }),
      clearCity: () => set({ selectedCity: null }),
    }),
    {
      name: 'luxe-city',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
