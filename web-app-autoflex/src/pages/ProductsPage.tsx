import { type FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import {
  clearProductRawMaterialMutationState,
  clearProductRawMaterialsList,
  createProductRawMaterial,
  deleteProductRawMaterial,
  fetchProductRawMaterialsByProduct,
  updateProductRawMaterial,
} from '../features/productRawMaterials/productRawMaterialSlice'
import {
  clearMutationState,
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from '../features/products/productSlice'
import { fetchRawMaterials } from '../features/rawMaterials/rawMaterialSlice'
import { formatCurrencyBRL } from '../utils/formatters'

export function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, status, error, mutationStatus, mutationError } = useSelector(
    (state: RootState) => state.products
  )
  const rawMaterialsState = useSelector((state: RootState) => state.rawMaterials)
  const productRawMaterialsState = useSelector((state: RootState) => state.productRawMaterials)
  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedRawMaterialId, setSelectedRawMaterialId] = useState('')
  const [requiredQuantity, setRequiredQuantity] = useState('')
  const [editingRelationId, setEditingRelationId] = useState<number | null>(null)

  const statusLabelMap: Record<typeof status, string> = {
    idle: 'aguardando',
    loading: 'carregando',
    succeeded: 'concluido',
    failed: 'falhou',
  }

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts())
    }
  }, [dispatch, status])

  useEffect(() => {
    return () => {
      dispatch(clearMutationState())
      dispatch(clearProductRawMaterialsList())
      dispatch(clearProductRawMaterialMutationState())
    }
  }, [dispatch])

  useEffect(() => {
    if (rawMaterialsState.status === 'idle') {
      dispatch(fetchRawMaterials())
    }
  }, [dispatch, rawMaterialsState.status])

  useEffect(() => {
    if (editingId !== null) {
      dispatch(fetchProductRawMaterialsByProduct(editingId))
      dispatch(clearProductRawMaterialMutationState())
    } else {
      dispatch(clearProductRawMaterialsList())
    }
  }, [dispatch, editingId])

  const isSubmitting = mutationStatus === 'loading'
  const isEditing = editingId !== null
  const totalValue = items.reduce((sum, item) => sum + item.value, 0)

  const resetForm = () => {
    setName('')
    setValue('')
    setEditingId(null)
    resetRelationForm()
  }

  const resetRelationForm = () => {
    setSelectedRawMaterialId('')
    setRequiredQuantity('')
    setEditingRelationId(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const parsedValue = Number(value)

    if (!trimmedName || Number.isNaN(parsedValue)) {
      return
    }

    try {
      if (editingId !== null) {
        await dispatch(updateProduct({ id: editingId, name: trimmedName, value: parsedValue })).unwrap()
      } else {
        await dispatch(createProduct({ name: trimmedName, value: parsedValue })).unwrap()
      }

      resetForm()
      dispatch(clearMutationState())
    } catch {
      // Error handled in Redux state.
    }
  }

  const handleEdit = (productId: number) => {
    const product = items.find((item) => item.id === productId)
    if (!product) return

    setEditingId(product.id)
    setName(product.name)
    setValue(String(product.value))
    resetRelationForm()
    dispatch(clearMutationState())
  }

  const handleDelete = async (productId: number, productName: string) => {
    const confirmed = window.confirm(`Excluir o produto "${productName}"?`)
    if (!confirmed) return

    try {
      await dispatch(deleteProduct(productId)).unwrap()
      if (editingId === productId) {
        resetForm()
      }
    } catch {
      // Error handled in Redux state.
    }
  }

  const handleSaveRawMaterialRelation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (editingId === null) return

    const parsedRawMaterialId = Number(selectedRawMaterialId)
    const parsedRequiredQuantity = Number(requiredQuantity)

    if (Number.isNaN(parsedRawMaterialId) || Number.isNaN(parsedRequiredQuantity)) {
      return
    }

    try {
      if (editingRelationId !== null) {
        await dispatch(
          updateProductRawMaterial({
            id: editingRelationId,
            productId: editingId,
            rawMaterialId: parsedRawMaterialId,
            requiredQuantity: parsedRequiredQuantity,
          })
        ).unwrap()
      } else {
        await dispatch(
          createProductRawMaterial({
            productId: editingId,
            rawMaterialId: parsedRawMaterialId,
            requiredQuantity: parsedRequiredQuantity,
          })
        ).unwrap()
      }

      resetRelationForm()
      dispatch(clearProductRawMaterialMutationState())
    } catch {
      // Error handled in Redux state.
    }
  }

  const handleEditRelation = (relationId: number) => {
    const relation = productRawMaterialsState.items.find((item) => item.id === relationId)
    if (!relation) return

    setEditingRelationId(relation.id)
    setSelectedRawMaterialId(String(relation.rawMaterialId))
    setRequiredQuantity(String(relation.requiredQuantity))
    dispatch(clearProductRawMaterialMutationState())
  }

  const handleDeleteRelation = async (relationId: number, rawMaterialName: string) => {
    const confirmed = window.confirm(`Remover "${rawMaterialName}" da composição do produto?`)
    if (!confirmed) return

    try {
      await dispatch(deleteProductRawMaterial(relationId)).unwrap()
    } catch {
      // Error handled in Redux state.
    }
  }

  const rawMaterialsMap = new Map(rawMaterialsState.items.map((item) => [item.id, item.name]))
  const availableRawMaterials = rawMaterialsState.items
  const relationLoading = productRawMaterialsState.status === 'loading'
  const relationSubmitting = productRawMaterialsState.mutationStatus === 'loading'
  const canManageComposition = editingId !== null

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
                {formatCurrencyBRL(totalValue)}
              </h4>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">{isEditing ? 'Editar produto' : 'Novo produto'}</div>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12 col-md-6">
              <label htmlFor="product-name" className="form-label">
                Nome
              </label>
              <input
                id="product-name"
                className="form-control"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex.: Bobina de aco"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="col-12 col-md-3">
              <label htmlFor="product-value" className="form-label">
                Valor
              </label>
              <input
                id="product-value"
                className="form-control"
                type="number"
                min="0"
                step="0.01"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="0.00"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="col-12 col-md-3 d-flex align-items-end gap-2">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isSubmitting || !name.trim() || value === ''}
              >
                {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Cadastrar'}
              </button>

              {isEditing && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          {mutationError && (
            <div className="alert alert-danger mt-3 mb-0" role="alert">
              {mutationError}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          Composição do produto
          {editingId !== null && <span className="ms-2 text-secondary">#{editingId}</span>}
        </div>
        <div className="card-body">
          {!canManageComposition && (
            <div className="text-secondary mb-0">
              Selecione um produto em "Editar" para gerenciar matérias-primas e quantidades.
            </div>
          )}

          {canManageComposition && (
            <div className="d-grid gap-3">
              <form className="row g-3" onSubmit={handleSaveRawMaterialRelation}>
                <div className="col-12 col-md-6">
                  <label htmlFor="product-raw-material" className="form-label">
                    Matéria-prima
                  </label>
                  <select
                    id="product-raw-material"
                    className="form-select"
                    value={selectedRawMaterialId}
                    onChange={(event) => setSelectedRawMaterialId(event.target.value)}
                    disabled={relationSubmitting || rawMaterialsState.status === 'loading'}
                    required
                  >
                    <option value="">Selecione</option>
                    {availableRawMaterials.map((rawMaterial) => (
                      <option key={rawMaterial.id} value={rawMaterial.id}>
                        {rawMaterial.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-3">
                  <label htmlFor="required-quantity" className="form-label">
                    Quantidade necessária
                  </label>
                  <input
                    id="required-quantity"
                    className="form-control"
                    type="number"
                    min="0"
                    step="0.01"
                    value={requiredQuantity}
                    onChange={(event) => setRequiredQuantity(event.target.value)}
                    placeholder="0.00"
                    disabled={relationSubmitting}
                    required
                  />
                </div>

                <div className="col-12 col-md-3 d-flex align-items-end gap-2">
                  <button
                    type="submit"
                    className="btn btn-outline-primary w-100"
                    disabled={
                      relationSubmitting ||
                      relationLoading ||
                      rawMaterialsState.status === 'loading' ||
                      selectedRawMaterialId === '' ||
                      requiredQuantity === ''
                    }
                  >
                    {relationSubmitting
                      ? editingRelationId !== null
                        ? 'Salvando...'
                        : 'Vinculando...'
                      : editingRelationId !== null
                        ? 'Salvar'
                        : 'Vincular'}
                  </button>

                  {editingRelationId !== null && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={resetRelationForm}
                      disabled={relationSubmitting}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>

              {productRawMaterialsState.mutationError && (
                <div className="alert alert-danger mb-0" role="alert">
                  {productRawMaterialsState.mutationError}
                </div>
              )}

              {productRawMaterialsState.error && productRawMaterialsState.status === 'failed' && (
                <div className="alert alert-danger mb-0" role="alert">
                  {productRawMaterialsState.error}
                </div>
              )}

              {relationLoading && <div className="text-secondary">Carregando composição...</div>}

              {!relationLoading && productRawMaterialsState.items.length === 0 && (
                <div className="text-secondary">Nenhuma matéria-prima vinculada a este produto.</div>
              )}

              {!relationLoading && productRawMaterialsState.items.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-sm table-striped align-middle mb-0">
                    <thead>
                      <tr>
                        <th scope="col">ID relação</th>
                        <th scope="col">Matéria-prima</th>
                        <th scope="col">Qtd. necessária</th>
                        <th scope="col" className="text-end">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productRawMaterialsState.items.map((relation) => (
                        <tr key={relation.id}>
                          <td>{relation.id}</td>
                          <td>{rawMaterialsMap.get(relation.rawMaterialId) ?? `ID ${relation.rawMaterialId}`}</td>
                          <td>{relation.requiredQuantity}</td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm" role="group" aria-label="Ações da composição">
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() => handleEditRelation(relation.id)}
                                disabled={relationSubmitting}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() =>
                                  handleDeleteRelation(
                                    relation.id,
                                    rawMaterialsMap.get(relation.rawMaterialId) ?? `ID ${relation.rawMaterialId}`
                                  )
                                }
                                disabled={relationSubmitting}
                              >
                                Remover
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Produtos</span>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => dispatch(fetchProducts())}
              disabled={status === 'loading' || isSubmitting}
            >
              Atualizar lista
            </button>
            {(status === 'loading' || isSubmitting) && (
              <span className="spinner-border spinner-border-sm" aria-hidden="true" />
            )}
          </div>
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
                    <th scope="col" className="text-end">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>
                        {formatCurrencyBRL(product.value)}
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm" role="group" aria-label="Ações do produto">
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => handleEdit(product.id)}
                            disabled={isSubmitting}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(product.id, product.name)}
                            disabled={isSubmitting}
                          >
                            Excluir
                          </button>
                        </div>
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
