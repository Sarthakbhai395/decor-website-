import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IService } from '@/types';

interface BookingDraft {
  service: IService | null;
  cityId: string;
  date: string;
  timeSlot: string;
  guests: number;
  specialRequests: string;
  couponCode: string;
  discountAmount: number;
}

interface CartState {
  bookingDraft: BookingDraft;
  setBookingDraft: (draft: Partial<BookingDraft>) => void;
  clearBookingDraft: () => void;
}

const initialDraft: BookingDraft = {
  service: null,
  cityId: '',
  date: '',
  timeSlot: '',
  guests: 1,
  specialRequests: '',
  couponCode: '',
  discountAmount: 0,
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      bookingDraft: initialDraft,

      setBookingDraft: (draft) =>
        set((state) => ({
          bookingDraft: { ...state.bookingDraft, ...draft },
        })),

      clearBookingDraft: () => set({ bookingDraft: initialDraft }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
