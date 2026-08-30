"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { pageVariants } from "@/lib/motion"

/**
 * Transition de page fondue (opacity seule, GPU) au changement de route.
 * `mode="wait"` : la page sortante s'efface avant que l'entrante n'apparaisse.
 * Pas de translation : on ne veut pas entrer en conflit avec le scroll.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        style={{ minHeight: "100%", willChange: "opacity" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
