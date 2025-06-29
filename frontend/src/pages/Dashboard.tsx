import { useAuth } from '../contexts/AuthContext';
import { ProductList } from './ProductList';

export function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Welcome, {user?.firstName}!
                </h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="py-4">
                    <ProductList />
                </div>
            </div>
        </div>
    );
} 