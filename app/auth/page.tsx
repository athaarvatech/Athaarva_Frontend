"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { API_CONFIG } from "@/lib/api-config";
import { Notification, NotificationType } from "@/components/ui/notification";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MedicalLogo from "@/components/ui/MedicalLogo";
import { 
  User, 
  Stethoscope, 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Shield,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  LogIn,
  UserPlus,
  Check,
  Key,
  KeyRound
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

type UserType = "patient" | "doctor" | "hospital";

const userTypes = [
  {
    id: "patient" as UserType,
    title: "Patient",
    subtitle: "Access your health records",
    icon: User,
    gradient: "from-blue-500 to-blue-600"
  },
  {
    id: "doctor" as UserType,
    title: "Doctor",
    subtitle: "Manage your practice",
    icon: Stethoscope,
    gradient: "from-emerald-500 to-emerald-600"
  },
  {
    id: "hospital" as UserType,
    title: "Hospital",
    subtitle: "Complete system access",
    icon: Building2,
    gradient: "from-purple-500 to-purple-600"
  }
];

const trustFeatures = [
  {
    icon: Shield,
    text: "HIPAA Compliant"
  },
  {
    icon: CheckCircle,
    text: "End-to-End Encryption"
  },
  {
    icon: Lock,
    text: "Secure Authentication"
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.6
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const formVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.3,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const inputVariants = {
  focus: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  blur: {
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.02,
    y: -2,
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: {
      duration: 0.1,
      ease: "easeOut"
    }
  }
};

const userTypeVariants = {
  inactive: {
    scale: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  active: {
    scale: 1.05,
    borderColor: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    borderColor: "#d1d5db",
    transition: {
      duration: 0.15,
      ease: "easeOut"
    }
  }
};

function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  
  // Authentication mode and UI state
  const [authMode, setAuthMode] = useState<"signin" | "signup" | "verify-otp" | "forgot-password" | "reset-password">("signin");
  const [selectedUserType, setSelectedUserType] = useState<UserType>("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Notifications and alerts
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
    show: boolean;
  }>({
    type: 'info',
    message: '',
    show: false
  });
  
  // OTP verification state
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Password reset state
  const [resetToken, setResetToken] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  
  // Check URL parameters on component mount
  useEffect(() => {
    // Check for verification success
    if (searchParams.get('verified') === 'true') {
      setNotification({
        type: 'success',
        message: 'Email verified successfully! You can now sign in.',
        show: true
      });
    }
    
    // Check for password reset success
    if (searchParams.get('reset') === 'success') {
      setNotification({
        type: 'success',
        message: 'Password reset successful! You can now sign in with your new password.',
        show: true
      });
    }
    
    // Check for email parameter (for OTP verification)
    const emailParam = searchParams.get('email');
    if (emailParam && searchParams.get('verify') === 'true') {
      setOtpEmail(emailParam);
      setAuthMode("verify-otp");
    }
    
    // Check for reset token
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setResetToken(tokenParam);
      setAuthMode("reset-password");
      
      // If we also have an email for reset
      const resetEmailParam = searchParams.get('email');
      if (resetEmailParam) {
        setResetEmail(resetEmailParam);
      }
    }
  }, [searchParams]);
  
  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);
  
  // Separate form data for sign in and sign up
  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  });
  
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: ""
  });

  const handleSignInChange = (field: string, value: string) => {
    setSignInData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUpChange = (field: string, value: string) => {
    setSignUpData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === "signup") {
        // Sign up new user
        const signUpPayload = {
          email: signUpData.email,
          password: signUpData.password,
          confirm_password: signUpData.confirmPassword,
          full_name: signUpData.fullName,
          phone: signUpData.phone,
          user_type: selectedUserType as 'patient' | 'doctor' | 'hospital'
        };

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.SIGNUP}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signUpPayload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Sign up failed');
        }

        const authData = await response.json();
        
        // Check if verification is required
        if (authData.requires_verification) {
          // Switch to OTP verification directly in this page
          setOtpEmail(signUpData.email);
          setAuthMode("verify-otp");
          setNotification({
            type: 'success',
            message: 'Account created! Please verify your email to continue.',
            show: true
          });
        } else {
          // Store token in localStorage if provided
          if (authData.access_token) {
            localStorage.setItem('access_token', authData.access_token);
          }
          
          // Redirect to onboarding based on user type
          if (selectedUserType === "doctor") {
            router.push("/onboarding/doctor");
          } else if (selectedUserType === "patient") {
            router.push("/onboarding/patient");
          } else {
            router.push("/dashboard/hospital");
          }
        }
      } else {
        // Sign in existing user
        const signInPayload = {
          email: signInData.email,
          password: signInData.password
        };

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.SIGNIN}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signInPayload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.detail || 'Sign in failed';
          
          // Check for email verification error specifically
          if (errorMessage.includes('verify') || errorMessage.includes('verification')) {
            // Set email for OTP verification
            setOtpEmail(signInData.email);
            setNotification({
              type: 'warning',
              message: 'Please verify your email before logging in. We\'ve sent you a verification code.',
              show: true
            });
            setTimeout(() => {
              setAuthMode("verify-otp");
            }, 1500);
            setIsLoading(false);
            return;
          }
          
          throw new Error(errorMessage);
        }

        const authData = await response.json();
        
        // Use AuthContext login method
        login(authData.access_token, authData.user_type, authData.user_id);
        
        // The AuthContext will handle redirecting based on onboarding status
        setNotification({
          type: 'success',
          message: 'Sign in successful! Redirecting...',
          show: true
        });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during authentication';
      
      setNotification({
        type: 'error',
        message: errorMessage,
        show: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(forgotPasswordEmail)) {
      setNotification({
        type: 'error',
        message: 'Please enter a valid email address',
        show: true
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send reset email');
      }

      setNotification({
        type: 'success',
        message: 'If an account with that email exists, we\'ve sent you a password reset link.',
        show: true
      });
      
      // Switch back to signin after a brief delay
      setTimeout(() => {
        setAuthMode("signin");
        setForgotPasswordEmail("");
      }, 3000);

    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred',
        show: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification request
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpCode || otpCode.length < 4) {
      setNotification({
        type: 'error',
        message: 'Please enter a valid verification code',
        show: true
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: otpEmail, otp_code: otpCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to verify email');
      }

      setNotification({
        type: 'success',
        message: 'Email verified successfully! You can now sign in.',
        show: true
      });
      
      // Switch back to signin after a brief delay
      setTimeout(() => {
        setAuthMode("signin");
        setOtpCode("");
      }, 2000);

    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred',
        show: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resending OTP verification code
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.RESEND_OTP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: otpEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to resend verification code');
      }

      setNotification({
        type: 'success',
        message: 'A new verification code has been sent to your email.',
        show: true
      });
      
      // Set cooldown timer (60 seconds)
      setResendCooldown(60);

    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred',
        show: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      setNotification({
        type: 'error',
        message: 'Passwords do not match',
        show: true
      });
      return;
    }
    
    if (newPassword.length < 8) {
      setNotification({
        type: 'error',
        message: 'Password must be at least 8 characters',
        show: true
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reset_token: resetToken,
          email: resetEmail,
          new_password: newPassword,
          confirm_password: confirmNewPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to reset password');
      }

      setNotification({
        type: 'success',
        message: 'Password reset successful! You can now sign in with your new password.',
        show: true
      });
      
      // Switch back to signin after a brief delay
      setTimeout(() => {
        setAuthMode("signin");
        setNewPassword("");
        setConfirmNewPassword("");
      }, 2000);

    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred',
        show: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = () => {
    if (authMode === "signin") {
      return signInData.email.trim() && signInData.password.trim();
    } else {
      return (
        signUpData.email.trim() &&
        signUpData.password.trim() &&
        signUpData.confirmPassword.trim() &&
        signUpData.fullName.trim() &&
        signUpData.phone.trim() &&
        signUpData.password === signUpData.confirmPassword
      );
    }
  };

  // Handle tab change and reset password visibility
  const handleTabChange = (value: string) => {
    setAuthMode(value as "signin" | "signup");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFocusedField(null);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-healthcare-cool-white via-white to-emerald-50/40 flex items-center justify-center">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute -top-32 -right-32 w-64 h-64 bg-healthcare-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-healthcare-emerald/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [180, 270, 360]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-4 h-full flex items-center">
        {/* Notification Component */}
        <Notification
          type={notification.type}
          message={notification.message}
          isVisible={notification.show}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
        />
        
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Side - Branding & Features */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:block space-y-6"
          >
            <div className="space-y-3">
              <motion.div variants={itemVariants} className="flex items-center space-x-3">
                <motion.div 
                  className="w-18 h-18 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center p-1"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <MedicalLogo width={50} height={50} />
                </motion.div>
                <h1 className="text-3xl font-bold text-healthcare-dark">Atharva</h1>
              </motion.div>
              
              <motion.h2 variants={itemVariants} className="text-4xl font-bold text-gray-900 leading-tight">
                Your Health,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-healthcare-primary to-healthcare-emerald">
                  Simplified & Secure
                </span>
              </motion.h2>
              
              <motion.p variants={itemVariants} className="text-lg text-gray-600 leading-relaxed max-w-md">
                Join thousands of healthcare providers and patients who trust Atharva 
                for comprehensive healthcare management with holistic care approach.
              </motion.p>
            </div>

            {/* Trust Features */}
            <motion.div variants={itemVariants} className="space-y-3">
              {trustFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center space-x-3 group cursor-pointer"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-br from-healthcare-primary/10 to-healthcare-emerald/10 rounded-lg flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <feature.icon className="w-5 h-5 text-healthcare-primary" />
                  </motion.div>
                  <span className="text-gray-700 font-medium group-hover:text-healthcare-primary transition-colors duration-200">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              {[
                { value: "10K+", label: "Doctors" },
                { value: "50K+", label: "Patients" },
                { value: "99.9%", label: "Uptime" }
              ].map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="text-3xl font-bold bg-gradient-to-r from-healthcare-primary to-healthcare-emerald text-transparent bg-clip-text"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
          >
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-xl overflow-hidden">
               

                <CardContent className="space-y-4">
                  {/* Show tabs only for signin/signup modes */}
                  {(authMode === "signin" || authMode === "signup") && (
                <>
                  <CardHeader className="space-y-1 text-center pb-4">
                    <motion.div
                      key={authMode}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {authMode === "signin" 
                          ? "Welcome Back" 
                          : authMode === "forgot-password" 
                            ? "" 
                            : "Create Account"
                        }
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {authMode === "signin" 
                          ? "Sign in to your Atharva account"
                          : authMode === "forgot-password" 
                            ? ""
                            : "Join Atharva and start your healthcare journey"
                        }
                      </CardDescription>
                    </motion.div>
                  </CardHeader>
                  <Tabs value={authMode} onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100/80">
                      <TabsTrigger value="signin" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <LogIn className="w-4 h-4" />
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger value="signup" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <UserPlus className="w-4 h-4" />
                        Sign Up
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </>
                  )}
                  
                  {/* Custom Header for Non-Standard Auth Modes */}
                  {authMode === "verify-otp" && (
                    <>
                      <div className="mt-4 mb-4 text-center">
                        <motion.div
                          className="w-12 h-12 bg-healthcare-primary/10 rounded-full flex items-center justify-center mx-auto mb-3"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Mail className="w-6 h-6 text-healthcare-primary" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-gray-900">Verify Your Email</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          We&apos;ve sent a verification code to your email
                        </p>
                      </div>
                      
                      <motion.form 
                        onSubmit={handleVerifyOtp}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="space-y-4"
                      >
                        {otpEmail && (
                          <div className="text-center text-sm bg-gray-50 p-3 rounded-lg text-gray-600">
                            Verification code sent to: <span className="font-medium">{otpEmail}</span>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Label htmlFor="otp-code" className="text-sm font-medium text-gray-700">Verification Code</Label>
                          <div className="relative">
                            <motion.div
                              animate={{
                                color: focusedField === "otp-code" ? "#10b981" : "#9ca3af"
                              }}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2"
                            >
                              <KeyRound className="w-4 h-4" />
                            </motion.div>
                            <Input
                              id="otp-code"
                              type="text"
                              placeholder="Enter verification code"
                              className="pl-10 h-11 rounded-lg border-gray-200 focus:border-healthcare-primary focus:ring-2 focus:ring-healthcare-primary/20"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              onFocus={() => setFocusedField("otp-code")}
                              onBlur={() => setFocusedField(null)}
                              required
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-healthcare-primary to-healthcare-emerald hover:shadow-lg text-white font-medium h-11 rounded-lg transition-all duration-300"
                              disabled={isLoading || !otpCode}
                            >
                              <AnimatePresence mode="wait">
                                {isLoading ? (
                                  <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                  >
                                    <motion.div
                                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                      animate={{ rotate: 360 }}
                                      transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear"
                                      }}
                                    />
                                    Verifying...
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="button-text"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                  >
                                    Verify Email
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </Button>
                          </motion.div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2 text-sm">
                          <Button
                            type="button"
                            variant="link"
                            className="text-gray-600 hover:text-healthcare-primary p-0 h-auto"
                            onClick={() => {
                              setAuthMode("signin");
                              setOtpCode("");
                            }}
                          >
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back
                          </Button>
                          
                          <Button
                            type="button"
                            variant="link"
                            className={`text-gray-600 hover:text-healthcare-primary p-0 h-auto ${resendCooldown > 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                            onClick={handleResendOtp}
                            disabled={resendCooldown > 0}
                          >
                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                          </Button>
                        </div>
                      </motion.form>
                    </>
                  )}
                  
                  {authMode === "forgot-password" && (
                    <>
                      <div className="mt-4 mb-4 text-center">
                        <motion.div
                          className="w-12 h-12 bg-healthcare-primary/10 rounded-full flex items-center justify-center mx-auto mb-3"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Key className="w-6 h-6 text-healthcare-primary" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-gray-900">Forgot Password?</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Enter your email and we&apos;ll send you a reset link
                        </p>
                      </div>
                      
                      <motion.form 
                        onSubmit={handleForgotPassword}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="forgot-email" className="text-sm font-medium text-gray-700">Email Address</Label>
                          <div className="relative">
                            <motion.div
                              animate={{
                                color: focusedField === "forgot-email" ? "#10b981" : "#9ca3af"
                              }}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2"
                            >
                              <Mail className="w-4 h-4" />
                            </motion.div>
                            <Input
                              id="forgot-email"
                              type="email"
                              placeholder="you@example.com"
                              className="pl-10 h-11 rounded-lg border-gray-200 focus:border-healthcare-primary focus:ring-2 focus:ring-healthcare-primary/20"
                              value={forgotPasswordEmail}
                              onChange={(e) => setForgotPasswordEmail(e.target.value)}
                              onFocus={() => setFocusedField("forgot-email")}
                              onBlur={() => setFocusedField(null)}
                              required
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-healthcare-primary to-healthcare-emerald hover:shadow-lg text-white font-medium h-11 rounded-lg transition-all duration-300"
                              disabled={isLoading || !forgotPasswordEmail}
                            >
                              <AnimatePresence mode="wait">
                                {isLoading ? (
                                  <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                  >
                                    <motion.div
                                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                      animate={{ rotate: 360 }}
                                      transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear"
                                      }}
                                    />
                                    Sending...
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="button-text"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                  >
                                    Send Reset Link
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </Button>
                          </motion.div>
                        </div>

                        <div className="text-center pt-4">
                          <Button
                            type="button"
                            variant="link"
                            className="text-gray-600 hover:text-healthcare-primary text-sm p-0 h-auto flex items-center justify-center mx-auto"
                            onClick={() => {
                              setAuthMode("signin");
                              setForgotPasswordEmail("");
                            }}
                          >
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Sign In
                          </Button>
                        </div>
                      </motion.form>
                    </>
                  )}
                  
                  {authMode === "reset-password" && (
                    <>
                      <div className="mb-4 text-center">
                        <motion.div
                          className="mt-4 w-12 h-12 bg-healthcare-primary/10 rounded-full flex items-center justify-center mx-auto mb-3"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <KeyRound className=" w-6 h-6 text-healthcare-primary" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-gray-900">Reset Your Password</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Create a new secure password for your account
                        </p>
                      </div>
                      
                      <motion.form 
                        onSubmit={handleResetPassword}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="space-y-4"
                      >
                        {resetEmail && (
                          <div className="text-center text-sm bg-gray-50 p-3 rounded-lg text-gray-600">
                            Resetting password for: <span className="font-medium">{resetEmail}</span>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Label htmlFor="reset-password" className="text-sm font-medium text-gray-700">New Password</Label>
                          <div className="relative">
                            <motion.div
                              animate={{
                                color: focusedField === "reset-password" ? "#10b981" : "#9ca3af"
                              }}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2"
                            >
                              <Lock className="w-4 h-4" />
                            </motion.div>
                            <motion.div
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4 text-gray-500" />
                              ) : (
                                <Eye className="w-4 h-4 text-gray-500" />
                              )}
                            </motion.div>
                            <Input
                              id="reset-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="New password"
                              className="pl-10 pr-10 h-11 rounded-lg border-gray-200 focus:border-healthcare-primary focus:ring-2 focus:ring-healthcare-primary/20"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              onFocus={() => setFocusedField("reset-password")}
                              onBlur={() => setFocusedField(null)}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="reset-confirm-password" className="text-sm font-medium text-gray-700">Confirm New Password</Label>
                          <div className="relative">
                            <motion.div
                              animate={{
                                color: focusedField === "reset-confirm-password" ? "#10b981" : "#9ca3af"
                              }}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2"
                            >
                              <Lock className="w-4 h-4" />
                            </motion.div>
                            <Input
                              id="reset-confirm-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              className="pl-10 h-11 rounded-lg border-gray-200 focus:border-healthcare-primary focus:ring-2 focus:ring-healthcare-primary/20"
                              value={confirmNewPassword}
                              onChange={(e) => setConfirmNewPassword(e.target.value)}
                              onFocus={() => setFocusedField("reset-confirm-password")}
                              onBlur={() => setFocusedField(null)}
                              required
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-healthcare-primary to-healthcare-emerald hover:shadow-lg text-white font-medium h-11 rounded-lg transition-all duration-300"
                              disabled={isLoading || !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword}
                            >
                              <AnimatePresence mode="wait">
                                {isLoading ? (
                                  <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                  >
                                    <motion.div
                                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                      animate={{ rotate: 360 }}
                                      transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear"
                                      }}
                                    />
                                    Resetting...
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="button-text"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                  >
                                    Reset Password
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </Button>
                          </motion.div>
                        </div>
                        
                        <div className="text-center pt-2">
                          <Button
                            type="button"
                            variant="link"
                            className="text-gray-600 hover:text-healthcare-primary text-sm p-0 h-auto"
                            onClick={() => {
                              setAuthMode("signin");
                              setNewPassword("");
                              setConfirmNewPassword("");
                            }}
                          >
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Sign In
                          </Button>
                        </div>
                      </motion.form>
                    </>
                  )}

                  <AnimatePresence mode="wait">
                      {/* Sign In Form */}
                      {authMode === "signin" && (
                        <motion.form
                          key="signin-form"
                          variants={formVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          onSubmit={handleSubmit}
                          className="space-y-4"
                        >
                          {/* Email */}
                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">
                              Email Address
                            </Label>
                            <div className="relative">
                              <motion.div
                                animate={{
                                  color: focusedField === "signin-email" ? "#10b981" : "#9ca3af"
                                }}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                              >
                                <Mail className="w-4 h-4" />
                              </motion.div>
                              <motion.div
                                variants={inputVariants}
                                animate={focusedField === "signin-email" ? "focus" : "blur"}
                              >
                                <Input
                                  id="signin-email"
                                  type="email"
                                  placeholder="you@example.com"
                                  className="pl-10 h-11 rounded-lg border-gray-200 focus:border-healthcare-primary focus:ring-2 focus:ring-healthcare-primary/20 transition-all duration-200"
                                  value={signInData.email}
                                  onChange={(e) => handleSignInChange("email", e.target.value)}
                                  onFocus={() => setFocusedField("signin-email")}
                                  onBlur={() => setFocusedField(null)}
                                  required
                                />
                              </motion.div>
                              {signInData.email && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                  <Check className="w-4 h-4 text-green-500" />
                                </motion.div>
                              )}
                            </div>
                          </motion.div>

                          {/* Password */}
                          <motion.div 
                            className="space-y-2"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center justify-between">
                              <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">
                                Password
                              </Label>
                              <motion.button
                                type="button"
                                onClick={() => setAuthMode("forgot-password")}
                                className="text-xs text-healthcare-primary hover:text-healthcare-teal transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Forgot password?
                              </motion.button>
                            </div>
                            <div className="relative">
                              <motion.div
                                animate={{
                                  color: focusedField === "signin-password" ? "#10b981" : "#9ca3af"
                                }}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                              >
                                <Lock className="w-4 h-4" />
                              </motion.div>
                              <motion.div
                                variants={inputVariants}
                                animate={focusedField === "signin-password" ? "focus" : "blur"}
                              >
                                <Input
                                  id="signin-password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  className="pl-10 pr-10 h-11 rounded-lg border-gray-200 focus:border-healthcare-primary focus:ring-2 focus:ring-healthcare-primary/20 transition-all duration-200"
                                  value={signInData.password}
                                  onChange={(e) => handleSignInChange("password", e.target.value)}
                                  onFocus={() => setFocusedField("signin-password")}
                                  onBlur={() => setFocusedField(null)}
                                  required
                                />
                              </motion.div>
                              <motion.button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </motion.button>
                            </div>
                          </motion.div>

                          {/* Sign In Button */}
                          <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-healthcare-primary to-healthcare-emerald hover:shadow-lg text-white font-medium h-11 rounded-lg transition-all duration-300"
                              disabled={!isFormValid() || isLoading}
                            >
                              <AnimatePresence mode="wait">
                                {isLoading ? (
                                  <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                  >
                                    <motion.div
                                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                      animate={{ rotate: 360 }}
                                      transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear"
                                      }}
                                    />
                                    Signing In...
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="button-text"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                  >
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </Button>
                          </motion.div>
                          
                          {/* Forgot Password Link */}
                          <motion.div
                            className="text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Button
                              type="button"
                              variant="link"
                              className="text-healthcare-primary hover:text-healthcare-primary/80 text-sm p-0 h-auto"
                              onClick={() => setAuthMode("forgot-password")}
                            >
                              Forgot your password?
                            </Button>
                          </motion.div>
                        </motion.form>
                      )}

                      {/* Sign Up Form */}
                      {authMode === "signup" && (
                        <motion.form
                          key="signup-form"
                          variants={formVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          onSubmit={handleSubmit}
                          className="space-y-4"
                        >
                          {/* User Type Selection */}
                          <motion.div 
                            className="space-y-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <Label className="text-sm font-medium text-gray-700">I am a:</Label>
                            <RadioGroup
                              value={selectedUserType}
                              onValueChange={(value) => setSelectedUserType(value as UserType)}
                              className="grid grid-cols-3 gap-2"
                            >
                              {userTypes.map((type, index) => (
                                <motion.div
                                  key={type.id}
                                  variants={userTypeVariants}
                                  whileHover="hover"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ 
                                    opacity: 1, 
                                    scale: selectedUserType === type.id ? 1.05 : 1,
                                    backgroundColor: selectedUserType === type.id ? "#f0f9ff" : "transparent",
                                    borderColor: selectedUserType === type.id ? "#3b82f6" : "transparent"
                                  }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <Label
                                    htmlFor={type.id}
                                    className="cursor-pointer p-3 rounded-lg border-2 transition-all duration-300 block"
                                  >
                                    <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                                    <div className="text-center space-y-1">
                                      <motion.div
                                        animate={{
                                          scale: selectedUserType === type.id ? 1.1 : 1,
                                          color: selectedUserType === type.id ? "#10b981" : "#9ca3af"
                                        }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <type.icon className="w-6 h-6 mx-auto" />
                                      </motion.div>
                                      <motion.div 
                                        className="text-xs font-semibold"
                                        animate={{
                                          color: selectedUserType === type.id ? "#10b981" : "#6b7280"
                                        }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        {type.title}
                                      </motion.div>
                                    </div>
                                  </Label>
                                </motion.div>
                              ))}
                            </RadioGroup>
                          </motion.div>

                          <Separator className="bg-gray-200" />

                          {/* Name and Phone */}
                          <motion.div 
                            className="grid grid-cols-2 gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <motion.div 
                              className="space-y-1.5"
                              whileHover={{ scale: 1.01 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</Label>
                              <motion.div
                                variants={inputVariants}
                                animate={focusedField === "fullName" ? "focus" : "blur"}
                              >
                                <Input
                                  id="fullName"
                                  placeholder="John Doe"
                                  className="h-10 rounded-lg border-gray-200 focus:border-healthcare-primary focus:ring-2 focus:ring-healthcare-primary/20 transition-all duration-200"
                                  value={signUpData.fullName}
                                  onChange={(e) => handleSignUpChange("fullName", e.target.value)}
                                  onFocus={() => setFocusedField("fullName")}
                                  onBlur={() => setFocusedField(null)}
                                  required
                                />
                              </motion.div>
                            </motion.div>
                            <motion.div 
                              className="space-y-1.5"
                              whileHover={{ scale: 1.01 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
                              <motion.div
                                variants={inputVariants}
                                animate={focusedField === "phone" ? "focus" : "blur"}
                              >
                                <Input
                                  id="phone"
                                  type="tel"
                                  placeholder="+91 98765 43210"
                                  className="h-10 rounded-lg border-gray-200 focus:border-healthcare-primary focus:ring-2 focus:ring-healthcare-primary/20 transition-all duration-200"
                                  value={signUpData.phone}
                                  onChange={(e) => handleSignUpChange("phone", e.target.value)}
                                  onFocus={() => setFocusedField("phone")}
                                  onBlur={() => setFocusedField(null)}
                                  required
                                />
                              </motion.div>
                            </motion.div>
                          </motion.div>

                          {/* Email */}
                          <motion.div 
                            className="space-y-1.5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">Email Address</Label>
                            <div className="relative">
                              <motion.div
                                animate={{
                                  color: focusedField === "signup-email" ? "#10b981" : "#9ca3af"
                                }}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                              >
                                <Mail className="w-4 h-4" />
                              </motion.div>
                              <motion.div
                                variants={inputVariants}
                                animate={focusedField === "signup-email" ? "focus" : "blur"}
                              >
                                <Input
                                  id="signup-email"
                                  type="email"
                                  placeholder="you@example.com"
                                  className="pl-10 h-10 rounded-lg border-gray-200 focus:border-healthcare-primary focus:ring-2 focus:ring-healthcare-primary/20 transition-all duration-200"
                                  value={signUpData.email}
                                  onChange={(e) => handleSignUpChange("email", e.target.value)}
                                  onFocus={() => setFocusedField("signup-email")}
                                  onBlur={() => setFocusedField(null)}
                                  required
                                />
                              </motion.div>
                            </div>
                          </motion.div>

                          {/* Password */}
                          <motion.div 
                            className="grid grid-cols-2 gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <motion.div 
                              className="space-y-1.5"
                              whileHover={{ scale: 1.01 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">Password</Label>
                              <div className="relative">
                                <motion.div
                                  animate={{
                                    color: focusedField === "signup-password" ? "#10b981" : "#9ca3af"
                                  }}
                                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                >
                                  <Lock className="w-4 h-4" />
                                </motion.div>
                                <motion.div
                                  variants={inputVariants}
                                  animate={focusedField === "signup-password" ? "focus" : "blur"}
                                >
                                  <Input
                                    id="signup-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 h-10 rounded-lg border-gray-200 focus:border-healthcare-primary focus:ring-2 focus:ring-healthcare-primary/20 transition-all duration-200"
                                    value={signUpData.password}
                                    onChange={(e) => handleSignUpChange("password", e.target.value)}
                                    onFocus={() => setFocusedField("signup-password")}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                  />
                                </motion.div>
                                <motion.button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </motion.button>
                              </div>
                            </motion.div>
                            <motion.div 
                              className="space-y-1.5"
                              whileHover={{ scale: 1.01 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm</Label>
                              <div className="relative">
                                <motion.div
                                  animate={{
                                    color: focusedField === "confirmPassword" ? "#10b981" : "#9ca3af"
                                  }}
                                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                >
                                  <Lock className="w-4 h-4" />
                                </motion.div>
                                <motion.div
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="w-4 h-4 text-gray-500" />
                                  ) : (
                                    <Eye className="w-4 h-4 text-gray-500" />
                                  )}
                                </motion.div>
                                <motion.div
                                  variants={inputVariants}
                                  animate={focusedField === "confirmPassword" ? "focus" : "blur"}
                                >
                                  <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 h-10 rounded-lg border-gray-200 focus:border-healthcare-primary focus:ring-2 focus:ring-healthcare-primary/20 transition-all duration-200"
                                    value={signUpData.confirmPassword}
                                    onChange={(e) => handleSignUpChange("confirmPassword", e.target.value)}
                                    onFocus={() => setFocusedField("confirmPassword")}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                  />
                                </motion.div>
                              </div>
                            </motion.div>
                          </motion.div>

                          {/* Sign Up Button */}
                          <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-healthcare-primary to-healthcare-emerald hover:shadow-lg text-white font-medium h-11 rounded-lg transition-all duration-300"
                              disabled={!isFormValid() || isLoading}
                            >
                              <AnimatePresence mode="wait">
                                {isLoading ? (
                                  <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                  >
                                    <motion.div
                                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                      animate={{ rotate: 360 }}
                                      transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear"
                                      }}
                                    />
                                    Creating Account...
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="button-text"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                  >
                                    Create Account
                                    <ArrowRight className="w-4 h-4" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </Button>
                          </motion.div>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {/* Footer Links */}
                    <motion.div 
                      className="text-center text-sm text-gray-600 pt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {authMode === "signin" ? (
                        <span>
                          Don&apos;t have an account?{" "}
                          <motion.button
                            type="button"
                            onClick={() => setAuthMode("signup")}
                            className="text-healthcare-primary hover:text-healthcare-emerald font-medium transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Sign up
                          </motion.button>
                        </span>
                      ) : (
                        <span>
                          Already have an account?{" "}
                          <motion.button
                            type="button"
                            onClick={() => setAuthMode("signin")}
                            className="text-healthcare-primary hover:text-healthcare-emerald font-medium transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Sign in
                          </motion.button>
                        </span>
                      )}
                    </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mobile Trust Features */}
            <motion.div 
              className="lg:hidden mt-6 flex justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {trustFeatures.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex flex-col items-center space-y-1"
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-healthcare-primary/10 to-healthcare-emerald/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-healthcare-primary" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium text-center">{feature.text.split(' ')[0]}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
