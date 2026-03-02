import { type FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import {
  clearRawMaterialsMutationState,
  createRawMaterial,
  deleteRawMaterial,
  fetchRawMaterials,
  updateRawMaterial,
} from '../features/rawMaterials/rawMaterialSlice'

export function RawMaterialsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, status, error, mutationStatus, mutationError } = useSelector(
    (state: RootState) => state.rawMaterials
  )
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  const statusLabelMap: Record<typeof status, string> = {
    idle: 'aguardando',
    loading: 'carregando',
    succeeded: 'concluído',
    failed: 'falhou',
  }

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRawMaterials())
    }
  }, [dispatch, status])

  useEffect(() => {
    return () => {
      dispatch(clearRawMaterialsMutationState())
    }
  }, [dispatch])

  const isSubmitting = mutationStatus === 'loading'
  const isEditing = editingId !== null
  const totalQuantity = items.reduce((sum, item) => sum + Number(item.stockQuantity ?? 0), 0)

  const resetForm = () => {
    setName('')
    setQuantity('')
    setEditingId(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const parsedQuantity = Number(quantity)

    if (!trimmedName || Number.isNaN(parsedQuantity)) {
      return
    }

    try {
      if (editingId !== null) {
        await dispatch(
          updateRawMaterial({ id: editingId, name: trimmedName, stockQuantity: parsedQuantity })
        ).unwrap()
      } else {
        await dispatch(createRawMaterial({ name: trimmedName, stockQuantity: parsedQuantity })).unwrap()
      }

      resetForm()
      dispatch(clearRawMaterialsMutationState())
    } catch {
      // Error handled in Redux state.
    }
  }

  const handleEdit = (rawMaterialId: number) => {
    const rawMaterial = items.find((item) => item.id === rawMaterialId)
    if (!rawMaterial) return

    setEditingId(rawMaterial.id)
    setName(rawMaterial.name)
    setQuantity(String(rawMaterial.stockQuantity ?? 0))
    dispatch(clearRawMaterialsMutationState())
  }

  const handleDelete = async (rawMaterialId: number, rawMaterialName: string) => {
    const confirmed = window.confirm(`Excluir a matéria-prima "${rawMaterialName}"?`)
    if (!confirmed) return

    try {
      await dispatch(deleteRawMaterial(rawMaterialId)).unwrap()
      if (editingId === rawMaterialId) {
        resetForm()
      }
    } catch {
      // Error handled in Redux state.
    }
  }

  return (
    <div className="d-grid gap-3">
      <div className="row g-3">
        <div className="col-12 col-md-4 col-xl-3">
          <div className="card h-100">
            <div className="card-body">
              <p className="text-secondary small mb-1">Total de itens</p>
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
              <p className="text-secondary small mb-1">Quantidade total</p>
              <h4 className="mb-0">{totalQuantity.toLocaleString('pt-BR')}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">{isEditing ? 'Editar matéria-prima' : 'Nova matéria-prima'}</div>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12 col-md-6">
              <label htmlFor="raw-material-name" className="form-label">
                Nome
              </label>
              <input
                id="raw-material-name"
                className="form-control"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex.: Chapa de aço"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="col-12 col-md-3">
              <label htmlFor="raw-material-quantity" className="form-label">
                Quantidade
              </label>
              <input
                id="raw-material-quantity"
                className="form-control"
                type="number"
                min="0"
                step="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder="0"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="col-12 col-md-3 d-flex align-items-end gap-2">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isSubmitting || !name.trim() || quantity === ''}
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
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Matérias-primas</span>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => dispatch(fetchRawMaterials())}
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
              {error ?? 'Erro ao carregar matérias-primas'}
            </div>
          )}

          {status !== 'failed' && items.length === 0 && (
            <div className="text-secondary">
              {status === 'loading' ? 'Carregando matérias-primas...' : 'Nenhuma matéria-prima encontrada.'}
            </div>
          )}

          {items.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Quantidade</th>
                    <th scope="col" className="text-end">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((rawMaterial) => (
                    <tr key={rawMaterial.id}>
                      <td>{rawMaterial.id}</td>
                      <td>{rawMaterial.name}</td>
                      <td>{Number(rawMaterial.stockQuantity ?? 0).toLocaleString('pt-BR')}</td>
                      <td className="text-end">
                        <div
                          className="btn-group btn-group-sm"
                          role="group"
                          aria-label="Ações da matéria-prima"
                        >
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => handleEdit(rawMaterial.id)}
                            disabled={isSubmitting}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(rawMaterial.id, rawMaterial.name)}
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
