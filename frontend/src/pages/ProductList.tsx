import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

interface Product {
    id: string
    name: string
    description: string
    price: number
    tags: string[]
    createdAt?: string
    updatedAt?: string
}

export function ProductList() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedTag, setSelectedTag] = useState('')
    const { user } = useAuth()

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products')
            setProducts(response.data)
            setLoading(false)
        } catch (error) {
            setError('Failed to fetch products')
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    // Get all unique tags from products
    const allTags = useMemo(() => {
        const tags = products.flatMap(product => product.tags || [])
        return Array.from(new Set(tags)).sort()
    }, [products])

    // Filter products based on search term and selected tag
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = searchTerm === '' ||
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesTag = selectedTag === '' ||
                (product.tags && product.tags.includes(selectedTag))

            return matchesSearch && matchesTag
        })
    }, [products, searchTerm, selectedTag])

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return
        }

        setDeleteLoading(true)
        try {
            await axios.delete(`/api/products/${id}`)
            await fetchProducts() // Refresh the list
        } catch (error) {
            setError('Failed to delete product')
        } finally {
            setDeleteLoading(false)
        }
    }

    const clearFilters = () => {
        setSearchTerm('')
        setSelectedTag('')
    }

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading...</div>
        </div>
    }

    if (error) {
        return <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
        </div>
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Products</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all products in your inventory.
                    </p>
                </div>
                {user && (
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <Link
                            to="/products/new"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                        >
                            Add product
                        </Link>
                    </div>
                )}
            </div>

            {/* Search and Filter Section */}
            <div className="mt-6 bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Search by name/description */}
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                            Search by name or description
                        </label>
                        <div className="mt-1 relative">
                            <input
                                type="text"
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Enter search term..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Filter by tag */}
                    <div>
                        <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700">
                            Filter by tag
                        </label>
                        <select
                            id="tag-filter"
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="">All tags</option>
                            {allTags.map(tag => (
                                <option key={tag} value={tag}>{tag}</option>
                            ))}
                        </select>
                    </div>

                    {/* Clear filters button */}
                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            disabled={!searchTerm && !selectedTag}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Clear filters
                        </button>
                    </div>
                </div>

                {/* Results summary */}
                {(searchTerm || selectedTag) && (
                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredProducts.length} of {products.length} products
                        {searchTerm && (
                            <span> matching "{searchTerm}"</span>
                        )}
                        {selectedTag && (
                            <span> tagged with "{selectedTag}"</span>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                        >
                                            Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Description
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Tags
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Price
                                        </th>

                                        {user && (
                                            <th
                                                scope="col"
                                                className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                            >
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={user ? 5 : 4} className="px-6 py-8 text-center text-sm text-gray-500">
                                                {searchTerm || selectedTag ? 'No products match your filters.' : 'No products found.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <tr key={product.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {product.name}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-500 max-w-xs">
                                                    <div className="truncate">{product.description}</div>
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-500">
                                                    <div className="flex flex-wrap gap-1">
                                                        {product.tags && product.tags.length > 0 ? (
                                                            product.tags.map((tag, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-400 italic">No tags</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    ${product.price.toFixed(2)}
                                                </td>

                                                {user && (
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <div className="flex justify-end space-x-4">
                                                            <Link
                                                                to={`/products/${product.id}/edit`}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(product.id)}
                                                                disabled={deleteLoading}
                                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                            >
                                                                {deleteLoading ? 'Deleting...' : 'Delete'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 