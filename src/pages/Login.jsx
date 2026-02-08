import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log('Login data:', data);
    // Auth logic will be implemented later
  };

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Card */}
        <div className="bg-(--bg-secondary) rounded-3xl shadow-xl border border-(--border-color) p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                Creatix
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-(--text-primary)">Welcome Back</h1>
            <p className="text-(--text-secondary) mt-2">
              Sign in to continue your creative journey
            </p>
          </div>

          {/* Google Sign In */}
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-(--border-color) bg-(--bg-primary) hover:bg-(--bg-tertiary) transition-colors mb-6">
            <FcGoogle className="w-5 h-5" />
            <span className="font-medium text-(--text-primary)">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-(--border-color)" />
            <span className="text-sm text-(--text-muted)">or</span>
            <div className="flex-1 h-px bg-(--border-color)" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-(--text-primary) mb-2">
                Email Address
              </label>
              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-(--text-muted)" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-(--bg-primary) border border-(--border-color) text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-(--text-primary) mb-2">
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-(--text-muted)" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-(--bg-primary) border border-(--border-color) text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary)"
                >
                  {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-linear-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/25"
            >
              Sign In
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-6 text-(--text-secondary)">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
