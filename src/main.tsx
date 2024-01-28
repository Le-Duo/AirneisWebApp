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
import LegalNoticePage from './pages/LegalNoticePage'
import TOSPage from './pages/TOSPage'
import SearchPage from './pages/SearchPage'
import SigninPage from './pages/SigninPage'
import SignupPage from './pages/SignupPage'
import ShippingAdressPage from './pages/ShippingAdressPage.tsx'
import PaymentMethodPage from './pages/PaymentMethodPage.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import PlaceOrderPage from './pages/PlaceOrderPage.tsx'
import OrderPage from './pages/OrderPage.tsx'
import OrderHistoryPage from './pages/OrderHistoryPage'
import Index from './pages/index.tsx'
import PasswordResetRequest from './components/PasswordResetRequest'
import PasswordReset from './components/PasswordReset'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StoreProvider } from './Store'

// Création du routeur avec les routes de l'application
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Index />} />
      <Route index={true} path="/products" element={<ProductsPage />} />
      <Route path="product/:slug" element={<ProductPage />} />
      <Route path="cart" element={<CartPage />} />{' '}
      <Route path="/search" element={<SearchPage />} />
      <Route path="/legal-notice" element={<LegalNoticePage />} />
      <Route path="/tos" element={<TOSPage />} />
      <Route path="*" element={<h1>Not Found</h1>} />
      <Route path="signin" element={<SigninPage />} />
      <Route path="signup" element={<SignupPage />} />{' '}
      <Route
        path="/password-reset-request"
        element={<PasswordResetRequest />}
      />
      <Route path="/password-reset/:token" element={<PasswordReset />} />
      <Route path="" element={<ProtectedRoute />}>
        <Route path="shipping" element={<ShippingAdressPage />} />
        <Route path="payment" element={<PaymentMethodPage />} />
        <Route path="placeorder" element={<PlaceOrderPage />} />
        <Route path="order/:id" element={<OrderPage />} />
        <Route path="/orderhistory" element={<OrderHistoryPage />} />
      </Route>
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
