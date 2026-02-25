import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import { fetchProducts } from '../features/products/productSlice'

export function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, status, error } = useSelector((state: RootState) => state.products)
  const statusLabelMap: Record<typeof status, string> = {
    idle: 'aguardando',
    loading: 'carregando',
    succeeded: 'concluído',
    failed: 'falhou',
  }

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts())
    }
  }, [dispatch, status])

  const totalValue = items.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="d-grid gap-3">
      <div className="row g-3">
        <div className="col-12 col-md-4 col-xl-3">
          <div className="card h-100">
            <div className="card-body">
              <p className="text-secondary small mb-1">Total de produtos</p>
              <h4 className="mb-0">{items.length}</h4>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 col-xl-3">
          <div className="card h-100">
            <div className="card-body">
              <p className="text-secondary small mb-1">Status</p>
              <h4 className="mb-0 text-capitalize">{statusLabelMap[status]}</h4>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 col-xl-6">
          <div className="card h-100">
            <div className="card-body">
              <p className="text-secondary small mb-1">Valor total</p>
              <h4 className="mb-0">
                {totalValue.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </h4>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Produtos</span>
          {status === 'loading' && (
            <span className="spinner-border spinner-border-sm" aria-hidden="true" />
          )}
        </div>
        <div className="card-body">
          {status === 'failed' && (
            <div className="alert alert-danger mb-0" role="alert">
              {error ?? 'Erro ao carregar produtos'}
            </div>
          )}

          {status !== 'failed' && items.length === 0 && (
            <div className="text-secondary">
              {status === 'loading' ? 'Carregando produtos...' : 'Nenhum produto encontrado.'}
            </div>
          )}

          {items.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>
                        {product.value.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
