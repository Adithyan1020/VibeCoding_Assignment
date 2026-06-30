import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfileSummary } from "@/types";

interface ListState {
  savedProfiles: UserProfileSummary[];
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (username: string) => void;
  isProfileSaved: (username: string) => boolean;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      savedProfiles: [],
      addProfile: (profile) =>
        set((state) => {
          if (state.savedProfiles.some((p) => p.username === profile.username)) {
            return state;
          }
          return { savedProfiles: [...state.savedProfiles, profile] };
        }),
      removeProfile: (username) =>
        set((state) => ({
          savedProfiles: state.savedProfiles.filter((p) => p.username !== username),
        })),
      isProfileSaved: (username) =>
        get().savedProfiles.some((p) => p.username === username),
    }),
    {
      name: "influencer-list-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
