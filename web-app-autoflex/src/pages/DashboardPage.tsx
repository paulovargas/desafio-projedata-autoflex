import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import { fetchProducts } from '../features/products/productSlice'
import { fetchProductionSimulation } from '../features/production/productionSlice'
import { fetchRawMaterials } from '../features/rawMaterials/rawMaterialSlice'
import { formatCurrencyBRL, formatNumberBR } from '../utils/formatters'

export function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const products = useSelector((state: RootState) => state.products)
  const rawMaterials = useSelector((state: RootState) => state.rawMaterials)
  const production = useSelector((state: RootState) => state.production)

  useEffect(() => {
    if (products.status === 'idle') {
      dispatch(fetchProducts())
    }
    if (rawMaterials.status === 'idle') {
      dispatch(fetchRawMaterials())
    }
    if (production.status === 'idle') {
      dispatch(fetchProductionSimulation())
    }
  }, [dispatch, products.status, rawMaterials.status, production.status])

  const producibleProducts = production.items.filter((item) => item.producibleQuantity > 0)
  const blockedProducts = Math.max(0, production.items.length - producibleProducts.length)
  const totalStockQuantity = rawMaterials.items.reduce((sum, item) => sum + Number(item.stockQuantity ?? 0), 0)
  const hasAnyLoading =
    products.status === 'loading' || rawMaterials.status === 'loading' || production.status === 'loading'

  const cards = [
    { title: 'Produtos', value: String(products.items.length), tone: 'primary' },
    { title: 'Matérias-primas', value: String(rawMaterials.items.length), tone: 'success' },
    { title: 'Produzíveis', value: String(producibleProducts.length), tone: 'warning' },
    {
      title: 'Valor simulado',
      value: formatCurrencyBRL(production.totalValue),
      tone: 'info',
    },
  ] as const

  return (
    <div className="d-grid gap-4">
      <section>
        <div className="row g-3">
          {cards.map((card) => (
            <div key={card.title} className="col-12 col-sm-6 col-xl-3">
              <div className={`card border-${card.tone} h-100`}>
                <div className="card-body">
                  <p className="text-secondary small mb-1">{card.title}</p>
                  <h3 className="mb-0">{card.value}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="row g-3">
        <div className="col-12 col-xl-8">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>Resumo operacional</span>
              {hasAnyLoading && <span className="spinner-border spinner-border-sm" aria-hidden="true" />}
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="border rounded p-3 h-100">
                    <p className="text-secondary small mb-1">Qtd. total sugerida para produção</p>
                    <h4 className="mb-0">{production.totalProducibleQuantity}</h4>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="border rounded p-3 h-100">
                    <p className="text-secondary small mb-1">Quantidade total em estoque (insumos)</p>
                    <h4 className="mb-0">{formatNumberBR(totalStockQuantity)}</h4>
                  </div>
                </div>
                <div className="col-12">
                  <p className="mb-0 text-secondary">
                    Painel alimentado pelos módulos de produtos, matérias-primas e simulação de produção.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card h-100">
            <div className="card-header">Status</div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between px-0">
                  <span>API</span>
                  <span className={`badge ${production.status === 'failed' ? 'text-bg-danger' : 'text-bg-success'}`}>
                    {production.status === 'failed' ? 'Erro' : 'Online'}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between px-0">
                  <span>Simulação</span>
                  <span
                    className={`badge ${
                      production.status === 'loading'
                        ? 'text-bg-warning'
                        : production.status === 'failed'
                          ? 'text-bg-danger'
                          : 'text-bg-success'
                    }`}
                  >
                    {production.status === 'loading'
                      ? 'Calculando'
                      : production.status === 'failed'
                        ? 'Falhou'
                        : 'Atualizada'}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between px-0">
                  <span>Produtos bloqueados</span>
                  <span className="badge text-bg-primary">{blockedProducts}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
