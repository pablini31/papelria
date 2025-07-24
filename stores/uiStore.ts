import { create } from "zustand"

interface UIStore {
  theme: "light" | "dark"
  sidebarOpen: boolean
  modals: {
    addProduct: boolean
    addCustomer: boolean
    checkout: boolean
  }
  loading: {
    global: boolean
    products: boolean
    customers: boolean
    sales: boolean
  }
  toggleTheme: () => void
  toggleSidebar: () => void
  openModal: (modal: keyof UIStore["modals"]) => void
  closeModal: (modal: keyof UIStore["modals"]) => void
  setLoading: (key: keyof UIStore["loading"], value: boolean) => void
}

export const useUIStore = create<UIStore>((set, get) => ({
  theme: "light",
  sidebarOpen: true,
  modals: {
    addProduct: false,
    addCustomer: false,
    checkout: false,
  },
  loading: {
    global: false,
    products: false,
    customers: false,
    sales: false,
  },

  toggleTheme: () => {
    set({ theme: get().theme === "light" ? "dark" : "light" })
  },

  toggleSidebar: () => {
    set({ sidebarOpen: !get().sidebarOpen })
  },

  openModal: (modal) => {
    set({
      modals: { ...get().modals, [modal]: true },
    })
  },

  closeModal: (modal) => {
    set({
      modals: { ...get().modals, [modal]: false },
    })
  },

  setLoading: (key, value) => {
    set({
      loading: { ...get().loading, [key]: value },
    })
  },
}))
