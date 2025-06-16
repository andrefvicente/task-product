import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Function to verify token and get user data
    const verifyToken = async (storedToken: string) => {
        try {
            // Set the token in axios headers first
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

            // Try to get user profile to verify token is still valid
            const response = await axios.get('/api/profile');
            setUser(response.data);
            setToken(storedToken);
            return true;
        } catch (error) {
            // Token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setToken(null);
            return false;
        }
    };

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken) {
                if (storedUser) {
                    // If we have both token and user in localStorage, try to use them
                    try {
                        const parsedUser = JSON.parse(storedUser);
                        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                        setUser(parsedUser);
                        setToken(storedToken);

                        // Verify the token is still valid in the background
                        verifyToken(storedToken);
                    } catch (error) {
                        // If user data is corrupted, verify token
                        await verifyToken(storedToken);
                    }
                } else {
                    // If we only have token, verify it and get user data
                    await verifyToken(storedToken);
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    // Update localStorage and axios headers when token changes
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Update localStorage when user changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post('/api/login', { email, password });
            setUser(response.data.user);
            setToken(response.data.token);
        } catch (error) {
            throw new Error('Invalid credentials');
        }
    };

    const register = async (firstName: string, lastName: string, email: string, password: string) => {
        try {
            const response = await axios.post('/api/register', {
                firstName,
                lastName,
                email,
                password,
            });
            setUser(response.data.user);
            setToken(response.data.token);
        } catch (error) {
            throw new Error('Registration failed');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    const forgotPassword = async (email: string) => {
        try {
            await axios.post('/api/forgot-password', { email });
        } catch (error) {
            throw new Error('Failed to send reset email');
        }
    };

    const resetPassword = async (token: string, password: string) => {
        try {
            await axios.post('/api/reset-password', { token, password });
        } catch (error) {
            throw new Error('Failed to reset password');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                forgotPassword,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 