export interface Product {
  id: string
  name: string
  description: string
  barcode: string
  category: ProductCategory
  subcategory: string
  purchasePrice: number
  salePrice: number
  stock: number
  minStock: number
  supplier: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: string
  name: string
  email?: string
  phone: string
  address?: string
  isFrequent: boolean
  discount: number
  totalPurchases: number
  createdAt: Date
  lastPurchase?: Date
}

export interface Sale {
  id: string
  customerId?: string
  items: SaleItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  paymentMethod: PaymentMethod
  amountPaid: number
  change: number
  createdAt: Date
  cashier: string
}

export interface SaleItem {
  productId: string
  product: Product
  quantity: number
  unitPrice: number
  discount: number
  total: number
}

export interface CartItem {
  product: Product
  quantity: number
  discount: number
}

export type ProductCategory =
  | "utiles-escolares"
  | "material-oficina"
  | "arte-manualidades"
  | "tecnologia"
  | "libros-revistas"
  | "regalos-juguetes"
  | "servicios"

export type PaymentMethod = "efectivo" | "tarjeta" | "transferencia"

export interface DashboardMetrics {
  todaySales: number
  todayTransactions: number
  lowStockProducts: number
  topProducts: Array<{
    product: Product
    quantity: number
    revenue: number
  }>
}
