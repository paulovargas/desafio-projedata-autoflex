import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProductsPage } from "./features/products/ProductsPage";

export function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/raw-materials" element={<div>Raw Materials</div>} />
      <Route path="/production" element={<div>Production</div>} />
    </Routes>
    </BrowserRouter>
  )
}