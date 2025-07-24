import { create } from "zustand"
import type { Customer } from "../types"

interface CustomerStore {
  customers: Customer[]
  loading: boolean
  searchTerm: string
  addCustomer: (customer: Omit<Customer, "id" | "createdAt" | "totalPurchases">) => void
  updateCustomer: (id: string, customer: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  setSearchTerm: (term: string) => void
  getFilteredCustomers: () => Customer[]
  getCustomerById: (id: string) => Customer | undefined
  getFrequentCustomers: () => Customer[]
}

// Array vacío inicial - los datos se cargarán desde MySQL
const mockCustomers: Customer[] = []

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: mockCustomers,
  loading: false,
  searchTerm: "",

  addCustomer: (customerData) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date(),
      totalPurchases: 0,
    }
    set({ customers: [...get().customers, newCustomer] })
  },

  updateCustomer: (id, customerData) => {
    set({
      customers: get().customers.map((customer) => (customer.id === id ? { ...customer, ...customerData } : customer)),
    })
  },

  deleteCustomer: (id) => {
    set({
      customers: get().customers.filter((customer) => customer.id !== id),
    })
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term })
  },

  getFilteredCustomers: () => {
    const { customers, searchTerm } = get()

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  },

  getCustomerById: (id) => {
    return get().customers.find((customer) => customer.id === id)
  },

  getFrequentCustomers: () => {
    return get().customers.filter((customer) => customer.isFrequent)
  },
}))
