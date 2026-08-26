"use client"

import { usePathname } from "next/navigation"

const TABS = [
  { href: "/compte", label: "Paramètres de compte" },
  { href: "/compte/commandes", label: "Commandes" },
]

export function AccountTabs() {
  const pathname = usePathname()

  return (
    <nav aria-label="Navigation du compte" className="account-tabs">
      {TABS.map((tab) => (
        <a
          key={tab.href}
          href={tab.href}
          className={`account-tabs__link${pathname === tab.href ? " account-tabs__link--active" : ""}`}
          aria-current={pathname === tab.href ? "page" : undefined}
        >
          {tab.label}
        </a>
      ))}
    </nav>
  )
}
