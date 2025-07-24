import { create } from "zustand"
import type { Product, ProductCategory } from "../types"

interface InventoryStore {
  products: Product[]
  categories: ProductCategory[]
  loading: boolean
  searchTerm: string
  selectedCategory: ProductCategory | "all"
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  updateStock: (id: string, quantity: number) => void
  setSearchTerm: (term: string) => void
  setSelectedCategory: (category: ProductCategory | "all") => void
  getFilteredProducts: () => Product[]
  getLowStockProducts: () => Product[]
  getProductById: (id: string) => Product | undefined
  getProductByBarcode: (barcode: string) => Product | undefined
}

// Array vacío inicial - los datos se cargarán desde MySQL
const mockProducts: Product[] = []

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  products: mockProducts,
  categories: [
    "utiles-escolares",
    "material-oficina",
    "arte-manualidades",
    "tecnologia",
    "libros-revistas",
    "regalos-juguetes",
    "servicios",
  ],
  loading: false,
  searchTerm: "",
  selectedCategory: "all",

  addProduct: (productData) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    set({ products: [...get().products, newProduct] })
  },

  updateProduct: (id, productData) => {
    set({
      products: get().products.map((product) =>
        product.id === id ? { ...product, ...productData, updatedAt: new Date() } : product,
      ),
    })
  },

  deleteProduct: (id) => {
    set({
      products: get().products.filter((product) => product.id !== id),
    })
  },

  updateStock: (id, quantity) => {
    set({
      products: get().products.map((product) =>
        product.id === id ? { ...product, stock: product.stock + quantity, updatedAt: new Date() } : product,
      ),
    })
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term })
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category })
  },

  getFilteredProducts: () => {
    const { products, searchTerm, selectedCategory } = get()

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  },

  getLowStockProducts: () => {
    return get().products.filter((product) => product.stock <= product.minStock)
  },

  getProductById: (id) => {
    return get().products.find((product) => product.id === id)
  },

  getProductByBarcode: (barcode) => {
    return get().products.find((product) => product.barcode === barcode)
  },
}))
