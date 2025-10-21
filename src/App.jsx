import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@shared/contexts/AuthContext'
import { CartProvider } from '@shared/contexts/CartContext'
import { ThemeProvider } from '@shared/contexts/ThemeContext'
import { ToastProvider } from '@shared/components/Toast'

// Customer Pages
import { CustomerLayout } from '@customer/layout/CustomerLayout'
import { Welcome } from '@customer/pages/Welcome'
import { MenuPage } from '@customer/pages/MenuPage'
import { Cart } from '@customer/pages/Cart'
import { OrderStatus } from '@customer/pages/OrderStatus'

// Admin Pages
import { AdminLayout } from '@admin/layout/AdminLayout'
import { Dashboard } from '@admin/pages/Dashboard'
import { Orders } from '@admin/pages/Orders'
import { QRGenerator } from '@admin/pages/QRGenerator'
import { MenuEditor } from '@admin/pages/MenuEditor'
import { EditProfile } from '@admin/pages/EditProfile'
import { Login } from '@admin/pages/Login'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return isAuthenticated ? children : <Navigate to="/owner/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <ToastProvider />
            <Routes>
            {/* Customer Routes */}
            <Route path="/m/:menuSlug/q/:token" element={<CustomerLayout />}>
              <Route index element={<Welcome />} />
              <Route path="menu" element={<MenuPage />} />
              <Route path="cart" element={<Cart />} />
              <Route path="order/:orderId" element={<OrderStatus />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/owner/login" element={<Login />} />
            <Route
              path="/owner"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/owner/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="menu" element={<MenuEditor />} />
              <Route path="qr" element={<QRGenerator />} />
              <Route path="profile" element={<EditProfile />} />
              <Route path="settings" element={<EditProfile />} />
              <Route path="analytics" element={<Dashboard />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/owner/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
