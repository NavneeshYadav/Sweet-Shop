'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import SubmitButton from '@/components/SubmitButton';

const SignupForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            fullName: '',
            phone: '',
            email: '',
            password: '',
            adminCode: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string()
                .min(3, 'Full Name must be at least 3 characters')
                .required('Full Name is required'),
            phone: Yup.string()
                .matches(/^\d{10}$/, 'Invalid phone number (10 digits required)')
                .required('Phone Number is required'),
            email: Yup.string()
                .email('Invalid email format')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            adminCode: Yup.string().test(
                'adminCode-check',
                'Invalid admin code',
                (value) => !value || value === 'NAVNEESH'
            ),
        }),
        onSubmit: (values, { resetForm }) => {
            const isAdmin = values.adminCode === 'NAVNEESH';
            const userData = {
                fullName: values.fullName,
                phone: values.phone,
                email: values.email,
                password: values.password,
                admin: isAdmin,
            };

            console.log('Signup data:', userData);
            resetForm();
            // handle API call here
        },
    });

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Sign Up</h2>
            <form onSubmit={formik.handleSubmit} noValidate>
                {/* Full Name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        {...formik.getFieldProps('fullName')}
                        className={`w-full px-3 py-2 border ${formik.touched.fullName && formik.errors.fullName
                                ? 'border-red-500'
                                : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400`}
                        placeholder="Your full name"
                    />
                    {formik.touched.fullName && formik.errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.fullName}</p>
                    )}
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="text"
                        {...formik.getFieldProps('phone')}
                        className={`w-full px-3 py-2 border ${formik.touched.phone && formik.errors.phone
                                ? 'border-red-500'
                                : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400`}
                        placeholder="Enter your phone number"
                    />
                    {formik.touched.phone && formik.errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        {...formik.getFieldProps('email')}
                        className={`w-full px-3 py-2 border ${formik.touched.email && formik.errors.email
                                ? 'border-red-500'
                                : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400`}
                        placeholder="you@example.com"
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div className="mb-4 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        {...formik.getFieldProps('password')}
                        className={`w-full px-3 py-2 border ${formik.touched.password && formik.errors.password
                                ? 'border-red-500'
                                : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400`}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-gray-600 hover:text-orange-500"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                    )}
                </div>

                {/* Admin Code */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Code (Optional)</label>
                    <input
                        type="text"
                        {...formik.getFieldProps('adminCode')}
                        className={`w-full px-3 py-2 border ${formik.touched.adminCode && formik.errors.adminCode
                                ? 'border-red-500'
                                : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400`}
                        placeholder="Enter Admin Code if any"
                    />
                    {formik.touched.adminCode && formik.errors.adminCode && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.adminCode}</p>
                    )}
                </div>

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
