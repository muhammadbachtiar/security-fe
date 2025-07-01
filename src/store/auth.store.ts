import { PermissionType, UserType } from "@/services/auth/auth.dto";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  user: UserType | null;
  coreToken: string | null;
  hrdToken: string | null;
  whToken: string | null;
  hrdRole: PermissionType[];
  coreRole: PermissionType[];
  whRole: PermissionType[];
  hasHydrated: boolean;
  logout: () => void;
  setHydrate: () => void;
  setUser: (value: UserType) => void;
  setRole: (
    type: "whRole" | "hrdRole" | "coreRole",
    value: PermissionType[]
  ) => void;
  setToken: (type: "whToken" | "hrdToken" | "coreToken", value: string) => void;
};

export const authStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      hrdToken: null,
      whToken: null,
      coreToken: null,
      whRole: [],
      hrdRole: [],
      coreRole: [],
      hasHydrated: false,
      setHydrate: () =>
        set((state) => ({
          ...state,
          hasHydrated: true,
        })),
      setRole: (type, value) =>
        set((state) => ({
          ...state,
          [type]: value,
        })),
      setToken: (type, value) =>
        set((state) => ({
          ...state,
          [type]: value,
        })),
      setUser: (value) =>
        set((state) => ({
          ...state,
          user: value,
        })),
      logout: () =>
        set({
          user: null,
          hrdToken: null,
          whToken: null,
          coreToken: null,
          whRole: [],
          hrdRole: [],
          coreRole: [],
          hasHydrated: true, // reset juga
        }),
    }),
    {
      name: "user_info",
      onRehydrateStorage: () => (state) => {
        state?.setHydrate();
      },
    }
  )
);
