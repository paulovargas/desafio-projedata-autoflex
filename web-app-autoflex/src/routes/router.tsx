import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { ProductsPage } from '../pages/ProductsPage'
import { RawMaterialsPage } from '../pages/RawMaterialsPage'
import { ProductionPage } from '../pages/ProductionPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'raw-materials', element: <RawMaterialsPage /> },
      { path: 'production', element: <ProductionPage /> },
    ],
  },
])
