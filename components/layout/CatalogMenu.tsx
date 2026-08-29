/**
 * Le catalogue ne comporte plus qu'une seule famille (Mobilier) : le menu
 * déroulant est remplacé par un lien direct. Pour revenir à un menu
 * multi-catégories, restaurer la version précédente de ce composant.
 */
export function CatalogMenu() {
  return (
    <a href="/categories/mobilier-moderne" className="catalog-menu__trigger" style={{ textDecoration: "none" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
      <span className="catalog-menu__trigger-label">Mobilier</span>
    </a>
  )
}
