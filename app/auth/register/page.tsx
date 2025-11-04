// // app/register/page.tsx

// "use client"; 
// /* NOTE: The page component is fully self-contained with mocked navigation 
// functions to ensure proper compilation and display in environments 
// where Next.js module imports are not resolved.
// */

// import { useState, FormEvent, useCallback } from "react";
// import { UserPlus } from 'lucide-react'; 

// // Mock function replacing Next.js useRouter
// const useRouter = () => ({
//     push: (path: string) => {
//         console.log(`Navigation Mock: Redirecting to ${path}`);
//         // In a live Next.js app, this pushes the user to the next page.
//     }
// });

// // Define the shape of the form data
// interface FormData {
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
// }

// // Define the shape of the component's state
// interface RegisterState {
//   formData: FormData;
//   isLoading: boolean;
//   error: string | null;
//   message: string | null;
// }

// export default function RegisterPage() {
//   const router = useRouter();

//   const [state, setState] = useState<RegisterState>({
//     formData: { name: "", email: "", phone: "", password: "" },
//     isLoading: false,
//     error: null,
//     message: null,
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setState((prev) => ({
//       ...prev,
//       formData: { ...prev.formData, [name]: value },
//       error: null, 
//     }));
//   };

//   const handleSubmit = useCallback(async (e: FormEvent) => {
//     e.preventDefault();
//     setState((prev) => ({ ...prev, isLoading: true, error: null, message: null }));
//     
//     // Simple front-end validation
//     const { name, email, password } = state.formData;
//     if (!name || !email || !password) {
//         setState((prev) => ({ ...prev, isLoading: false, error: "Name, email, and password are required." }));
//         return;
//     }
//     if (password.length < 8) {
//         setState((prev) => ({ ...prev, isLoading: false, error: "Password must be at least 8 characters long." }));
//         return;
//     }

//     try {
//       // POST data to the API route
//       const response = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(state.formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Success: User registered, OTP sent
//         const userId = data.userId || 'mock-user-id-123';
//         
//         setState((prev) => ({ 
//             ...prev, 
//             message: data.message || `Registration successful! Check email for OTP (ID: ${userId}).`,
//         }));
//         
//         // IMMEDIATE REDIRECTION to the OTP verification page
//         router.push(`/verify-otp?userId=${userId}`);
//       } else {
//         // Failure
//         setState((prev) => ({
//           ...prev,
//           error: data.error || "Registration failed. User may already exist.",
//         }));
//       }
//     } catch (err) {
//       console.error("Registration API error:", err);
//       setState((prev) => ({ ...prev, error: "Network error. Server may be unreachable." }));
//     } finally {
//         setState((prev) => ({ ...prev, isLoading: false }));
//     }
//   }, [state.formData, router]);

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 flex items-center justify-center space-x-2">
//           <UserPlus className="w-8 h-8 text-indigo-600"/>
//           <span>Create your account</span>
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Already a member? 
//           {/* Using a standard <a> tag to replace Next.js Link */}
//           <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
//             Sign in here
//           </a>
//         </p>
//         
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10">
//           
//           {/* Status Messages */}
//           {(state.error || state.message) && (
//             <div
//               className={`mb-4 p-3 rounded-lg text-sm transition-all duration-300 ${
//                 state.error ? "bg-red-100 text-red-700 border border-red-300" : "bg-green-100 text-green-700 border border-green-300"
//               }`}
//             >
//               {state.error || state.message}
//             </div>
//           )}
//           
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             
//             {/* Name Input */}
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                 Full Name
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   required
//                   value={state.formData.name}
//                   onChange={handleChange}
//                   disabled={state.isLoading}
//                   className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
//                 />
//               </div>
//             </div>

//             {/* Email Input */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email address
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={state.formData.email}
//                   onChange={handleChange}
//                   disabled={state.isLoading}
//                   className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
//                 />
//               </div>
//             </div>
//             
//             {/* Phone Input */}
//             <div>
//               <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//                 Phone Number (Optional)
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   autoComplete="tel"
//                   value={state.formData.phone}
//                   onChange={handleChange}
//                   disabled={state.isLoading}
//                   className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
//                 />
//               </div>
//             </div>

//             {/* Password Input */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="new-password"
//                   required
//                   minLength={8}
//                   value={state.formData.password}
//                   onChange={handleChange}
//                   disabled={state.isLoading}
//                   className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
//                 />
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={state.isLoading}
//                 className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white 
//                   ${state.isLoading 
//                     ? "bg-indigo-400 cursor-not-allowed" 
//                     : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
//                   }`
//                 }
//               >
//                 {state.isLoading ? (
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                 ) : "Register & Get Verification Code"}
//               </button>
//             </div>
//           </form>
//         </div>
//         {/* NOTE: The visual alignment issues from the previous attempt are fixed here via padding and full-width inputs. */}
//       </div>
//     </div>
//   );
// }




// app/register/page.tsx
// app/register/page.tsx

"use client";
import { useState, FormEvent, useCallback } from "react";
import { UserPlus, ArrowRight } from 'lucide-react';

// Mock function replacing Next.js useRouter
const useRouter = () => ({
    push: (path: string) => {
        console.log(`Navigation Mock: Redirecting to ${path}`);
        // In a real Next.js app, this would actually redirect
        window.location.href = path;
    }
});

// Define the shape of the form data
interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

// Define the shape of the component's state
interface RegisterState {
  formData: FormData;
  isLoading: boolean;
  error: string | null;
  message: string | null;
  redirectToOtp: boolean;
  userId: string | null;
}

export default function RegisterPage() {
  const router = useRouter();

  const [state, setState] = useState<RegisterState>({
    formData: { name: "", email: "", phone: "", password: "" },
    isLoading: false,
    error: null,
    message: null,
    redirectToOtp: false,
    userId: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [name]: value },
      error: null, 
    }));
  };

  // Function to handle OTP redirection
  const redirectToOtpPage = useCallback((userId: string) => {
    console.log(`Redirecting to OTP verification for user: ${userId}`);
    
    // Set a small delay to show success message before redirect
    setTimeout(() => {
      router.push(`/auth/verify-otp?userId=${encodeURIComponent(userId)}&email=${encodeURIComponent(state.formData.email)}`);
    }, 1500);
  }, [router, state.formData.email]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isLoading: true, error: null, message: null, redirectToOtp: false }));
    
    // Simple front-end validation
    const { name, email, password } = state.formData;
    if (!name || !email || !password) {
        setState((prev) => ({ ...prev, isLoading: false, error: "Name, email, and password are required." }));
        return;
    }
    if (password.length < 8) {
        setState((prev) => ({ ...prev, isLoading: false, error: "Password must be at least 8 characters long." }));
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setState((prev) => ({ ...prev, isLoading: false, error: "Please enter a valid email address." }));
        return;
    }

    try {
      // POST data to the API route
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: User registered, OTP sent
        const userId = data.userId || `user-${Date.now()}`;
        const userEmail = state.formData.email;
        
        setState((prev) => ({ 
            ...prev, 
            message: "Registration successful! Redirecting to OTP verification...",
            userId: userId,
            redirectToOtp: true,
        }));
        
        // Trigger OTP redirection
        redirectToOtpPage(userId);
        
      } else {
        // Failure
        setState((prev) => ({
          ...prev,
          error: data.error || "Registration failed. User may already exist.",
        }));
      }
    } catch (err) {
      console.error("Registration API error:", err);
      setState((prev) => ({ 
        ...prev, 
        error: "Network error. Server may be unreachable.",
      }));
    } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state.formData, redirectToOtpPage]);

  // If redirecting to OTP page, show loading state
  if (state.redirectToOtp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center py-8 px-4 sm:px-6 lg:px-8 font-inter">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">Redirecting to OTP verification...</p>
          <p className="text-sm text-gray-500">
            Please check your email at <strong>{state.formData.email}</strong> for the verification code
          </p>
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
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Create your account</h1>
            </div>
            <p className="text-indigo-100 text-sm">
              Join thousands of satisfied customers today
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
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={state.formData.name}
                    onChange={handleChange}
                    disabled={state.isLoading}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

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
                    value={state.formData.email}
                    onChange={handleChange}
                    disabled={state.isLoading}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              
              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={state.formData.phone}
                    onChange={handleChange}
                    disabled={state.isLoading}
                    placeholder="Enter your phone number"
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
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={state.formData.password}
                    onChange={handleChange}
                    disabled={state.isLoading}
                    placeholder="Create a strong password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters long
                </p>
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
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account & Verify
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already a member?{" "}
                <a 
                  href="/auth/login" 
                  className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors inline-flex items-center"
                >
                  Sign in here
                  <ArrowRight className="ml-1 w-4 h-4" />
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <a href="/terms" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}