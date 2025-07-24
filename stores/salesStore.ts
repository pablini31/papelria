import { create } from "zustand"
import type { Sale, DashboardMetrics } from "../types"

interface SalesStore {
  sales: Sale[]
  loading: boolean
  addSale: (sale: Omit<Sale, "id" | "createdAt">) => void
  getSalesByDateRange: (startDate: Date, endDate: Date) => Sale[]
  getTodaysSales: () => Sale[]
  getDashboardMetrics: () => DashboardMetrics
  getTotalRevenue: (startDate?: Date, endDate?: Date) => number
}

export const useSalesStore = create<SalesStore>((set, get) => ({
  sales: [],
  loading: false,

  addSale: (saleData) => {
    const newSale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    set({ sales: [...get().sales, newSale] })
  },

  getSalesByDateRange: (startDate, endDate) => {
    return get().sales.filter((sale) => {
      const saleDate = new Date(sale.createdAt)
      return saleDate >= startDate && saleDate <= endDate
    })
  },

  getTodaysSales: () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return get().getSalesByDateRange(today, tomorrow)
  },

  getDashboardMetrics: () => {
    const todaysSales = get().getTodaysSales()
    const todaySalesTotal = todaysSales.reduce((sum, sale) => sum + sale.total, 0)

    // Mock data for now
    return {
      todaySales: todaySalesTotal,
      todayTransactions: todaysSales.length,
      lowStockProducts: 3,
      topProducts: [],
    }
  },

  getTotalRevenue: (startDate, endDate) => {
    let sales = get().sales

    if (startDate && endDate) {
      sales = get().getSalesByDateRange(startDate, endDate)
    }

    return sales.reduce((sum, sale) => sum + sale.total, 0)
  },
}))
