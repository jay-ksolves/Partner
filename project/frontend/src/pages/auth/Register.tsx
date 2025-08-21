import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { loginSuccess } from '@/store/slices/authSlice';
import { addToast } from '@/store/slices/uiSlice';
import apiClient from '@/services/api';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      phone: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const { confirmPassword, ...registerData } = data;
      const response = await apiClient.post('/auth/register', registerData);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.data.accessToken);
      dispatch(loginSuccess(data.data.user));
      dispatch(
        addToast({
          type: 'success',
          title: 'Account Created!',
          message: 'Welcome to Partner Platform. Complete your KYC to get started.',
        })
      );
      navigate('/kyc');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Registration failed. Please try again.';
      dispatch(
        addToast({
          type: 'error',
          title: 'Registration Failed',
          message,
        })
      );
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create your account
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Join our partner network and start growing your business
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name & Company Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              {...form.register('name')}
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="John Doe"
            />
            {form.formState.errors.name && (
              <p className="text-red-600 text-sm mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Company Name
            </label>
            <input
              {...form.register('companyName')}
              type="text"
              id="companyName"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Acme Corp"
            />
            {form.formState.errors.companyName && (
              <p className="text-red-600 text-sm mt-1">
                {form.formState.errors.companyName.message}
              </p>
            )}
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              {...form.register('email')}
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="john@acme.com"
            />
            {form.formState.errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              {...form.register('phone')}
              type="tel"
              id="phone"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="+91 9876543210"
            />
            {form.formState.errors.phone && (
              <p className="text-red-600 text-sm mt-1">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              {...form.register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              {...form.register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full flex items-center justify-center px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {registerMutation.isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <UserPlus size={20} className="mr-2" />
              Create Account
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;