import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import { fetchProductionSimulation } from '../features/production/productionSlice'
import { formatCurrencyBRL } from '../utils/formatters'

export function ProductionPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, status, error, totalValue, totalProducibleQuantity } = useSelector(
    (state: RootState) => state.production
  )

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProductionSimulation())
    }
  }, [dispatch, status])

  const statusLabelMap: Record<typeof status, string> = {
    idle: 'aguardando',
    loading: 'carregando',
    succeeded: 'concluido',
    failed: 'falhou',
  }

  const producibleItems = items.filter((item) => item.producibleQuantity > 0)
  const blockedCount = items.length - producibleItems.length
  const producibleItemsTotalQuantity = producibleItems.reduce((sum, item) => sum + item.producibleQuantity, 0)
  const producibleItemsTotalValue = producibleItems.reduce((sum, item) => sum + item.totalValue, 0)

  return (
    <div className="d-grid gap-3">
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <p className="text-secondary small mb-1">Produtos produzíveis</p>
              <h4 className="mb-0">{producibleItems.length}</h4>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <p className="text-secondary small mb-1">Qtd. total sugerida</p>
              <h4 className="mb-0">{totalProducibleQuantity}</h4>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <p className="text-secondary small mb-1">Valor total sugerido</p>
              <h4 className="mb-0">{formatCurrencyBRL(totalValue)}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Simulação de produção (RF008)</span>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => dispatch(fetchProductionSimulation())}
              disabled={status === 'loading'}
            >
              Atualizar simulação
            </button>
            {status === 'loading' && <span className="spinner-border spinner-border-sm" aria-hidden="true" />}
          </div>
        </div>
        <div className="card-body">
          {status === 'failed' && (
            <div className="alert alert-danger mb-0" role="alert">
              {error ?? 'Erro ao carregar simulação de produção'}
            </div>
          )}

          {status !== 'failed' && items.length === 0 && (
            <div className="text-secondary">
              {status === 'loading'
                ? 'Calculando simulação de produção...'
                : 'Nenhum produto encontrado para simular.'}
            </div>
          )}

          {items.length > 0 && (
            <div className="d-grid gap-3">
              <div className="row g-3">
                <div className="col-12 col-lg-6">
                  <div className="text-secondary small">
                    Status da simulação: <span className="text-capitalize">{statusLabelMap[status]}</span>
                  </div>
                </div>
                <div className="col-12 col-lg-6 text-lg-end">
                  <div className="text-secondary small">
                    Produtos sem capacidade com estoque atual: {blockedCount}
                  </div>
                </div>
              </div>

              {producibleItems.length === 0 && (
                <div className="alert alert-warning mb-0" role="alert">
                  Nenhum produto pode ser produzido com o estoque atual.
                </div>
              )}

              {producibleItems.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th scope="col">ID produto</th>
                        <th scope="col">Produto</th>
                        <th scope="col">Qtd. produzível</th>
                        <th scope="col" className="text-end">
                          Valor total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {producibleItems.map((item) => (
                        <tr key={item.productId}>
                          <td>{item.productId}</td>
                          <td>{item.productName}</td>
                          <td>{item.producibleQuantity}</td>
                          <td className="text-end">{formatCurrencyBRL(item.totalValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th scope="row" colSpan={2}>
                          Total
                        </th>
                        <th>{producibleItemsTotalQuantity}</th>
                        <th className="text-end">{formatCurrencyBRL(producibleItemsTotalValue)}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
