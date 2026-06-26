"use client"

import { useState } from "react"
import { useCart } from "@/contexts/CartContext"
import type { StoreProductVariant, StoreProductOption } from "@medusajs/types"

type Props = {
  variants: StoreProductVariant[]
  options: StoreProductOption[]
}

export function AddToCartButton({ variants, options }: Props) {
  const { addItem, isLoading } = useCart()
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [added, setAdded] = useState(false)

  const selectedVariant = variants.find((v) =>
    options.every((opt) => {
      const selectedValue = selected[opt.id]
      if (!selectedValue) return false
      return v.options?.some(
        (o: any) => o.option_id === opt.id && o.value === selectedValue
      )
    })
  ) ?? (variants.length === 1 ? variants[0] : undefined)

  const handleAdd = async () => {
    if (!selectedVariant) return
    await addItem(selectedVariant.id)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div>
      {options.length > 1 && options.map((option) => (
        <div key={option.id} style={{ marginBottom: "1rem" }}>
          <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>{option.title}</p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {option.values?.map((val) => (
              <button
                key={val.id}
                onClick={() => setSelected((prev) => ({ ...prev, [option.id]: val.value }))}
                style={{
                  padding: "0.4rem 1rem",
                  border: selected[option.id] === val.value ? "2px solid #1a1a1a" : "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                  background: selected[option.id] === val.value ? "#f5f5f5" : "#fff",
                  fontSize: "0.875rem",
                  fontWeight: selected[option.id] === val.value ? "600" : "400",
                }}
              >
                {val.value}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleAdd}
        disabled={isLoading || !selectedVariant}
        style={{
          width: "100%",
          padding: "0.9rem",
          background: added ? "#2d6a2d" : !selectedVariant ? "#999" : "#1a1a1a",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: isLoading || !selectedVariant ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}
      >
        {added ? "Ajouté ✓" : isLoading ? "Chargement…" : "Ajouter au panier"}
      </button>
    </div>
  )
}
