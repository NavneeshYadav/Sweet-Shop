'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import SubmitButton from '@/components/SubmitButton';

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email format')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
        }),
        onSubmit: (values, { resetForm }) => {
            console.log('Form Submitted:', values);
            // handle login logic here
            resetForm();
        },
    });

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login</h2>
            <form onSubmit={formik.handleSubmit} noValidate>
                {/* Email Field */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        className={`w-full px-3 py-2 border ${formik.touched.email && formik.errors.email
                                ? 'border-red-500'
                                : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400`}
                        placeholder="you@example.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                    )}
                </div>

                {/* Password Field */}
                <div className="mb-4 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className={`w-full px-3 py-2 border ${formik.touched.password && formik.errors.password
                                ? 'border-red-500'
                                : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400`}
                        placeholder="••••••••"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-gray-600 hover:text-orange-400"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                    )}
                </div>

                {/* Submit */}
                <SubmitButton label="Login" />
            </form>
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-orange-400 underline">
                        Sign up with email
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

export default LoginForm;
