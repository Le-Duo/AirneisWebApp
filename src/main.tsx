import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import App from './App.tsx'
import './index.css'
import ProductsPage from './pages/ProductsPage.tsx'
import ProductPage from './pages/ProductPage.tsx'
import CartPage from './pages/CartPage'
import Index from './pages/index.tsx'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StoreProvider } from './Store'

// Création du routeur avec les routes de l'application
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {' '}
      <Route path="/" element={<Index />} />
      <Route index={true} path="/products" element={<ProductsPage />} />
      <Route path="product/:slug" element={<ProductPage />} />
      <Route path="cart" element={<CartPage />} />{' '}
    </Route>
  )
)

// Initialisation du client de requête
const queryClient = new QueryClient()

// Rendu de l'application dans le DOM
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
)
