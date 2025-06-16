import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

interface FormData {
    name: string
    description: string
    price: string
    tags: string
}

export function ProductForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [product, setProduct] = useState<Product>({
        id: '',
        name: '',
        description: '',
        price: 0,
        tags: []
    })
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        price: '',
        tags: ''
    })
    const [loading, setLoading] = useState(false)
    const [loadingSuggestions, setLoadingSuggestions] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await axios.get(`/api/products/${id}`)
                    setProduct(response.data)
                    setFormData({
                        name: response.data.name,
                        description: response.data.description,
                        price: response.data.price.toString(),
                        tags: response.data.tags.join(', ')
                    })
                } catch (error) {
                    setError('Failed to fetch product')
                }
            }
            fetchProduct()
        }
    }, [id, user, navigate])

    const handleSuggestTags = async () => {
        if (!formData.name.trim() || !formData.description.trim()) {
            setError('Please fill in the product name and description first to get tag suggestions')
            return
        }

        setLoadingSuggestions(true)
        setError('')

        try {
            const response = await axios.post('/api/suggest-tags', {
                name: formData.name,
                description: formData.description
            })

            const suggestedTags = response.data.suggestedTags

            // Merge existing tags with suggested tags, avoiding duplicates
            const existingTags = formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== '')

            const allTags = [...existingTags]

            suggestedTags.forEach((tag: string) => {
                const cleanTag = tag.trim()
                if (cleanTag && !allTags.some(existingTag =>
                    existingTag.toLowerCase() === cleanTag.toLowerCase()
                )) {
                    allTags.push(cleanTag)
                }
            })

            setFormData({ ...formData, tags: allTags.join(', ') })
        } catch (error) {
            console.error('Error getting tag suggestions:', error)
            setError('Failed to get tag suggestions. Please ensure the AI service is running.')
        } finally {
            setLoadingSuggestions(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const productData = {
                ...product,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
            }

            if (id) {
                await axios.put(`/api/products/${id}`, productData)
            } else {
                await axios.post('/api/products', productData)
            }
            navigate('/products')
        } catch (error) {
            setError('Failed to save product')
            setLoading(false)
        }
    }

    if (!user) {
        return null
    }

    return (
        <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                        {id ? 'Edit Product' : 'New Product'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                        {id ? 'Update the product information below.' : 'Fill in the product information below.'}
                    </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-md bg-red-50 p-4 mb-4">
                                <div className="text-sm text-red-700">{error}</div>
                            </div>
                        )}
                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="tags"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Tags (comma-separated)
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="tags"
                                            id="tags"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            placeholder="tag1, tag2, tag3"
                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleSuggestTags}
                                            disabled={loadingSuggestions || !formData.name.trim() || !formData.description.trim()}
                                            className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loadingSuggestions ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    AI Thinking...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                    </svg>
                                                    Suggest Tags
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                        AI will suggest relevant tags based on the product name and description
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor="price"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <button
                                    type="button"
                                    onClick={() => navigate('/products')}
                                    className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {loading ? 'Saving...' : id ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
} 