

// app/verify-otp/page.tsx

"use client"; 
import { useState, FormEvent, useEffect } from 'react';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';

// Simple router functions that don't use refs during render
const useRouter = () => ({
  push: (path: string) => {
    console.log(`Navigation Mock: Pushing to ${path}`);
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  },
  back: () => {
    console.log(`Navigation Mock: Going back`);
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }
});

// Custom hook to safely access search params
const useSearchParams = () => {
  const [params, setParams] = useState<{ userId: string; email: string }>({
    userId: '',
    email: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId') || '';
        const email = urlParams.get('email') || 'user@example.com';
        
        setParams({ userId, email });
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return {
    get: (key: string) => {
      if (key === 'userId') return params.userId;
      if (key === 'email') return params.email;
      return null;
    }
  };
};

interface VerificationState {
  otp: string[];
  isLoading: boolean;
  error: string | null;
  message: string | null;
}

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isClient, setIsClient] = useState(false);
  const userId = searchParams.get("userId");
  const userEmail = searchParams.get("email");

  const [state, setState] = useState<VerificationState>({
    otp: ["", "", "", "", "", ""],
    isLoading: false,
    error: null,
    message: null,
  });

  const [resendMessage, setResendMessage] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  // Set client flag and initial message
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);
      if (userEmail) {
        setState(prev => ({ 
          ...prev, 
          message: `Verification code sent to ${userEmail}` 
        }));
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [userEmail]);

  const handleVerification = async (otpString: string, identifier: string) => {
    if (!identifier) {
      setState(prev => ({
        ...prev,
        error: "Email is missing. Please register again.",
      }));
      return;
    }

    if (!otpString || otpString.length !== 6) {
      setState(prev => ({
        ...prev,
        error: "Please enter a valid 6-digit OTP code.",
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null, message: null }));

    try {
      // Send identifier (email) and OTP to match backend API
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          identifier: identifier, // This should be the email
          otp: otpString 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setState(prev => ({ 
          ...prev, 
          message: "Verification successful! Redirecting to home page...",
          isLoading: false 
        }));
        
        // Store access token in localStorage or context
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Redirect to Home page
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setState(prev => ({
          ...prev,
          error: data.error || "Invalid OTP code or code has expired.",
          isLoading: false
        }));
      }
    } catch (error) {
      console.error("Verification error:", error);
      setState(prev => ({ 
        ...prev, 
        error: "Network or server error. Please try again later.",
        isLoading: false 
      }));
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    
    const newOtp = [...state.otp];
    newOtp[index] = value;
    setState(prev => ({ ...prev, otp: newOtp, error: null }));

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto-submit when all digits are filled
    if (newOtp.every(digit => digit !== "") && index === 5) {
      const otpString = newOtp.join('');
      handleVerification(otpString, userEmail || '');
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !state.otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').slice(0, 6);
      const filledOtp = [...newOtp, ...Array(6 - newOtp.length).fill("")];
      setState(prev => ({ ...prev, otp: filledOtp, error: null }));
      
      const lastFilledIndex = Math.min(newOtp.length, 5);
      const lastInput = document.getElementById(`otp-${lastFilledIndex}`);
      if (lastInput) lastInput.focus();

      if (newOtp.length === 6) {
        handleVerification(pastedData, userEmail || '');
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const otpString = state.otp.join('');
    
    // Validate OTP before submission
    if (!otpString || otpString.length !== 6) {
      setState(prev => ({
        ...prev,
        error: "Please enter a complete 6-digit OTP code.",
      }));
      return;
    }

    if (!userEmail) {
      setState(prev => ({
        ...prev,
        error: "Email is missing. Please try registering again.",
      }));
      return;
    }

    handleVerification(otpString, userEmail);
  };

  const handleResend = async () => {
    if (!userEmail || resendCountdown > 0) return;
    
    setResendMessage("Sending new code...");

    try {
      // Call resend OTP API with email as identifier
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: userEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendMessage("New verification code sent!");
        setState(prev => ({ 
          ...prev, 
          error: null, 
          otp: ["", "", "", "", "", ""],
          message: "New verification code sent to your email"
        }));
        
        // Start countdown timer
        setResendCountdown(30);
        const countdownInterval = setInterval(() => {
          setResendCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Focus first input for better UX
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
      } else {
        setResendMessage(data.error || "Failed to resend code. Please try again.");
      }
    } catch (error) {
      setResendMessage("Network error. Please check your connection.");
    }
  };

  const fullOtp = state.otp.join('');

  // Show loading state while detecting client
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading verification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Verify Your Account</h1>
            </div>
            <p className="text-indigo-100 text-sm flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Enter the 6-digit code sent to your email</span>
            </p>
            {userEmail && (
              <p className="text-indigo-200 text-sm mt-2 font-medium">
                {userEmail}
              </p>
            )}
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

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* OTP Input Boxes */}
              <div className="flex flex-col items-center space-y-4">
                <label className="text-sm font-medium text-gray-700 text-center">
                  Enter 6-digit verification code
                </label>
                
                <div className="flex space-x-3" onPaste={handlePaste}>
                  {state.otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 bg-white shadow-sm"
                      disabled={state.isLoading}
                      autoFocus={index === 0 && !state.otp[0]}
                    />
                  ))}
                </div>
                
                <p className="text-xs text-gray-500 text-center">
                  Code will expire in 5 minutes
                </p>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={state.isLoading || fullOtp.length !== 6 || !userEmail}
                className={`w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white transition-all duration-200 ${
                  state.isLoading || fullOtp.length !== 6 || !userEmail
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                }`}
              >
                {state.isLoading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 mr-3" />
                    Verifying...
                  </>
                ) : (
                  "Verify Account"
                )}
              </button>
            </form>

            {/* Resend OTP Section */}
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Didn&apos;t receive the code?{" "}
                <button
                  onClick={handleResend}
                  disabled={state.isLoading || resendCountdown > 0}
                  className="font-semibold text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 transition-colors duration-200"
                >
                  {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend Code"}
                </button>
              </p>
              {resendMessage && (
                <p className={`text-xs mt-2 ${
                  resendMessage.includes("sent") ? "text-green-600" : "text-blue-600"
                }`}>
                  {resendMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}