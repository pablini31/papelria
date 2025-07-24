"use client"

import { Package, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Product } from "../../types"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onEdit?: (product: Product) => void
  showActions?: boolean
  className?: string
}

const categoryLabels = {
  "utiles-escolares": "Útiles Escolares",
  "material-oficina": "Material de Oficina",
  "arte-manualidades": "Arte y Manualidades",
  tecnologia: "Tecnología",
  "libros-revistas": "Libros y Revistas",
  "regalos-juguetes": "Regalos y Juguetes",
  servicios: "Servicios",
}

export function ProductCard({ product, onAddToCart, onEdit, showActions = true, className }: ProductCardProps) {
  const isLowStock = product.stock <= product.minStock
  const isOutOfStock = product.stock === 0

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardContent className="p-4 flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">{product.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
          </div>
          <div className="ml-2 flex-shrink-0">
            {product.image ? (
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
            ) : (
              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {categoryLabels[product.category]}
          </Badge>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">${product.salePrice.toFixed(2)}</span>
            <div className="text-right">
              <div
                className={cn(
                  "text-sm font-medium",
                  isOutOfStock && "text-destructive",
                  isLowStock && !isOutOfStock && "text-orange-600",
                )}
              >
                Stock: {product.stock}
              </div>
              {isLowStock && (
                <div className="flex items-center text-xs text-orange-600">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Stock bajo
                </div>
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">Código: {product.barcode}</div>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="p-4 pt-0 flex gap-2">
          {onAddToCart && (
            <Button onClick={() => onAddToCart(product)} disabled={isOutOfStock} className="flex-1" size="sm">
              {isOutOfStock ? "Sin Stock" : "Agregar"}
            </Button>
          )}
          {onEdit && (
            <Button onClick={() => onEdit(product)} variant="outline" size="sm">
              Editar
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
