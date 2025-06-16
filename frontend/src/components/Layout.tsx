import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
    children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Mobile menu button - moved to top left */}
                            <div className="sm:hidden flex items-center mr-4">
                                <button
                                    onClick={toggleMobileMenu}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                    aria-expanded="false"
                                >
                                    <span className="sr-only">Open main menu</span>
                                    {/* Hamburger icon */}
                                    <svg
                                        className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    {/* Close icon */}
                                    <svg
                                        className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-shrink-0 flex items-center">
                                <Link to="/" className="text-xl font-bold text-indigo-600">
                                    Admin Dashboard
                                </Link>
                            </div>
                            {user && (
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    <Link
                                        to="/"
                                        className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/products"
                                        className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Products
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Desktop menu */}
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-700">
                                        {user.firstName} {user.lastName}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to="/login"
                                        className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>


                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                        {user ? (
                            <>
                                <Link
                                    to="/"
                                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/products"
                                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Products
                                </Link>
                                <div className="border-t border-gray-200 pt-4 pb-3">
                                    <div className="px-3 py-2">
                                        <div className="text-base font-medium text-gray-800">
                                            {user.firstName} {user.lastName}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleLogout()
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main>{children}</main>
        </div>
    )
} 