import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearError, loginUser } from "../../../../../../loan/src/redux/slices/authSlice";

// Aapke Custom Components
import InputField from "../ui/InputField";
import Button from "../ui/Button";

export default function LoginForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
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
        if (user.role === "ADMIN") navigate("/admin");
        else if (user.role === "EMPLOYEE") navigate("/employee");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const onSubmit = (data) => {
    dispatch(loginUser({
      email: data.email.trim(),
      password: data.password,
    }));
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden border border-gray-100">
      
      {/* Success Message Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h3>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-blue-600 text-white p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
        <p className="text-blue-100 text-sm">Sign in to your account</p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
        
        {/* Email Field */}
        <InputField
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          isRequired
          isDisabled={loading || showSuccess}
          error={errors.email?.message}
          {...register("email", { 
            required: "Email is required",
            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email address" },
            onChange: () => error && dispatch(clearError())
          })}
        />

        {/* Password Field */}
        {/* Note: InputField handles the Eye/EyeOff toggle automatically internally */}
        <InputField
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          isRequired
          isDisabled={loading || showSuccess}
          error={errors.password?.message}
          {...register("password", { 
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters required" },
            onChange: () => error && dispatch(clearError())
          })}
        />

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg animate-in shake-100 duration-200">
            <p className="text-sm text-red-600 text-center font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || showSuccess}
          className="w-full justify-center py-3.5 shadow-lg active:scale-[0.98]"
        >
          {loading ? "Checking..." : "Sign In"}
        </Button>

      </form>
    </div>
  );
}