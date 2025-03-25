'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import SubmitButton from '@/components/SubmitButton';

const SignupForm = () => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminCode, setAdminCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ fullName?: string; phone?: string; email?: string; password?: string; adminCode?: string }>({});

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!fullName) {
            newErrors.fullName = 'Full Name is required';
        } else if (fullName.length < 3) {
            newErrors.fullName = 'Full Name must be at least 3 characters';
        }

        if (!phone) {
            newErrors.phone = 'Phone Number is required';
        } else if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = 'Invalid phone number (10 digits required)';
        }

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (adminCode && adminCode !== 'NAVNEESH') {
            newErrors.adminCode = 'Invalid admin code';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const isAdmin = adminCode === 'NAVNEESH';

            const userData = {
                fullName,
                phone,
                email,
                password,
                admin: isAdmin,
            };

            console.log('Signup data:', userData);
            // Send `userData` to backend API
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Sign Up</h2>
            <form onSubmit={handleSubmit} noValidate>
                {/* Full Name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        className={`w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400`}
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="text"
                        className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400`}
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400`}
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="mb-4 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400`}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-gray-600 hover:text-orange-500"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Admin Code */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Code (Optional)</label>
                    <input
                        type="text"
                        className={`w-full px-3 py-2 border ${errors.adminCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400`}
                        placeholder="Enter Admin Code if any"
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                    />
                    {errors.adminCode && <p className="text-red-500 text-sm mt-1">{errors.adminCode}</p>}
                </div>

                {/* Submit */}
                <SubmitButton label="Signup" />
            </form>

            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-orange-400 underline">
                        Login
                    </Link>
                </p>
                <p className="text-sm text-gray-600 mt-6">
                    <Link href="/" className="text-orange-400 underline">
                        Back to Home Page
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupForm;
