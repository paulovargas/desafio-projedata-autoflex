export interface NavItem {
  label: string
  path: string
  iconClass: string
}

export const navItems: NavItem[] = [
  { label: 'Painel', path: '/', iconClass: 'fa-solid fa-gauge-high' },
  { label: 'Produtos', path: '/products', iconClass: 'fa-solid fa-box-open' },
  { label: 'Matérias-primas', path: '/raw-materials', iconClass: 'fa-solid fa-cubes' },
  { label: 'Produção', path: '/production', iconClass: 'fa-solid fa-industry' },
]
