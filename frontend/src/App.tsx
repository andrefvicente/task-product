import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { ProductList } from './pages/ProductList';
import { ProductForm } from './pages/ProductForm';
import { Layout } from './components/Layout';

interface PrivateRouteProps {
    children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
    return (
        <AuthProvider>
            <Layout>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/products"
                        element={
                            <PrivateRoute>
                                <ProductList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/products/new"
                        element={
                            <PrivateRoute>
                                <ProductForm />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/products/:id/edit"
                        element={
                            <PrivateRoute>
                                <ProductForm />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Layout>
        </AuthProvider>
    );
}

export default App; 