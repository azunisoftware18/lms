import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { clearError } from "../../store/slices/authSlice";
import { useLogin } from "../../hooks/useAuth"; 

// Aapke Custom Components
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { loginSchema } from "../../validations/LoginValidations";

export default function LoginForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, user, error } = useSelector((state) => state.auth);
  
  // React Query mutation
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset //  Reset form on error
  } = useForm({
    resolver: zodResolver(loginSchema), 
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle Redirect after success
  useEffect(() => {
    if (isAuthenticated && user) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        //  Role-based redirect
        const role = user?.role?.toUpperCase();
        
        if (role === "SUPER_ADMIN" || role === "ADMIN") {
          navigate("/admin");
        } else if (role === "EMPLOYEE") {
          navigate("/employee");
        } else {
          navigate("/dashboard");
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  // Handle API errors
  useEffect(() => {
    if (loginMutation.error) {
      // Reset form on API error if needed
      // reset({}, { keepErrors: false });
    }
  }, [loginMutation.error, reset]);

  const onSubmit = (data) => {
    // Clear any previous errors
    dispatch(clearError());
    
    loginMutation.mutate({
      email: data.email.trim(),
      password: data.password,
    });
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden border border-gray-100">
      
      {/* Success Message Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h3>
          <p className="text-gray-600">
            {user?.role === "ADMIN" ? "Redirecting to Admin Dashboard..." : "Redirecting to Dashboard..."}
          </p>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-blue-600 text-white p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
        <p className="text-blue-100 text-sm">Sign in to your account</p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
        
        {/* Email Field - No inline validation */}
        <InputField
          label="Email Address"
          type="email"
          placeholder="admin@example.com"
          icon={Mail}
          isRequired
          isDisabled={loginMutation.isLoading || showSuccess}
          error={errors.email?.message} //  Error from Zod
          {...register("email")} //  No validation rules here
        />

        {/* Password Field - No inline validation */}
        <InputField
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          isRequired
          isDisabled={loginMutation.isLoading || showSuccess}
          error={errors.password?.message} //  Error from Zod
          {...register("password")} //  No validation rules here
        />

        {/* API Error Display */}
        {(error || loginMutation.error) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg animate-in shake-100 duration-200">
            <p className="text-sm text-red-600 text-center font-medium">
              {error || loginMutation.error?.response?.data?.message || "Invalid credentials"}
            </p>
          </div>
        )}

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link 
            to="/forgot-password" 
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loginMutation.isLoading || showSuccess}
          className="w-full justify-center py-3.5 shadow-lg active:scale-[0.98]"
        >
          {loginMutation.isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Signing in...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </Button>

        {/* Demo Credentials */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-700 font-medium mb-1">Demo Credentials:</p>
          <p className="text-xs text-gray-600">Email: admin@example.com</p>
          <p className="text-xs text-gray-600">Password: password123</p>
        </div>

      </form>
    </div>
  );
}