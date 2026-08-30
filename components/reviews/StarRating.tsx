"use client"

type Props = {
  value: number
  /** 0 = affichage seul ; sinon appelé au clic sur une étoile. */
  onChange?: (v: number) => void
  size?: number
  label?: string
}

export function StarRating({ value, onChange, size = 18, label }: Props) {
  const interactive = typeof onChange === "function"
  const rounded = Math.round(value * 2) / 2

  return (
    <span
      className="stars"
      role={interactive ? "radiogroup" : "img"}
      aria-label={label ?? `Note : ${value} sur 5`}
      style={{ fontSize: size }}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.floor(rounded)
        const half = !filled && i - 0.5 === rounded
        const glyph = filled ? "★" : half ? "⯨" : "☆"
        return interactive ? (
          <button
            key={i}
            type="button"
            className="stars__btn"
            role="radio"
            aria-checked={i === Math.round(value)}
            aria-label={`${i} étoile${i > 1 ? "s" : ""}`}
            onClick={() => onChange!(i)}
          >
            {i <= value ? "★" : "☆"}
          </button>
        ) : (
          <span key={i} aria-hidden="true">
            {glyph}
          </span>
        )
      })}
    </span>
  )
}
