import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from './productSlice'
import type { RootState, AppDispatch } from '../../app/store'

export function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, status, error } = useSelector(
    (state: RootState) => state.products
  )

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts())
    }
  }, [status, dispatch])

  if (status === 'loading') return <p>Loading...</p>
  if (status === 'failed') return <p>Error: {error}</p>

  return (
    <div className="container mt-4">
      <h2>Products</h2>
      <ul>
        {items.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.value}
          </li>
        ))}
      </ul>
    </div>
  )
}