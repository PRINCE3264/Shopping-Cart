// app/login/page.tsx

"use client";
import { useState, FormEvent, useEffect } from "react";
import { LogIn, ArrowRight, Eye, EyeOff } from 'lucide-react';

// Mock function replacing Next.js useRouter
const useRouter = () => ({
  push: (path: string) => {
    console.log(`Navigation Mock: Pushing to ${path}`);
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  }
});

interface LoginState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  message: string | null;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [state, setState] = useState<LoginState>({
    email: "",
    password: "",
    isLoading: false,
    error: null,
    message: null,
  });

  // Set client flag safely using setTimeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
      error: null,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isLoading: true, error: null, message: null }));

    // Simple front-end validation
    const { email, password } = state;
    if (!email || !password) {
      setState((prev) => ({ 
        ...prev, 
        isLoading: false, 
        error: "Email and password are required." 
      }));
      return;
    }

    if (!email.includes("@")) {
      setState((prev) => ({ 
        ...prev, 
        isLoading: false, 
        error: "Please enter a valid email address." 
      }));
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.email.toLowerCase().trim(),
          password: state.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: User logged in
        setState((prev) => ({ 
          ...prev, 
          message: "Login successful! Redirecting to home page...",
          isLoading: false 
        }));

        // Store tokens and user data
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Redirect to home page after successful login
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        // Failure
        setState((prev) => ({
          ...prev,
          error: data.error || "Login failed. Please check your credentials.",
          isLoading: false
        }));
      }
    } catch (error) {
      console.error("Login API error:", error);
      setState((prev) => ({ 
        ...prev, 
        error: "Network error. Server may be unreachable.",
        isLoading: false 
      }));
    }
  };

  // Show loading state while detecting client
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <LogIn className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            </div>
            <p className="text-indigo-100 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          <div className="px-6 py-8">
            {/* Status Messages */}
            {(state.error || state.message) && (
              <div
                className={`mb-6 p-4 rounded-xl text-sm transition-all duration-300 ${
                  state.error 
                    ? "bg-red-50 text-red-700 border border-red-200" 
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    state.error ? "bg-red-500" : "bg-green-500"
                  }`}></div>
                  {state.error || state.message}
                </div>
              </div>
            )}
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={state.email}
                    onChange={handleChange}
                    disabled={state.isLoading}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={state.password}
                    onChange={handleChange}
                    disabled={state.isLoading}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={state.isLoading}
                className={`w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white transition-all duration-200 ${
                  state.isLoading 
                    ? "bg-indigo-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                }`}
              >
                {state.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <a 
                  href="/auth/register" 
                  className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors inline-flex items-center"
                >
                  Create account
                  <ArrowRight className="ml-1 w-4 h-4" />
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}