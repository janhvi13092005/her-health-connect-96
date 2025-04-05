
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Heart } from "lucide-react";

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register, isLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Form validation errors
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [registerErrors, setRegisterErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // If user is already logged in, redirect to home
  if (user) {
    navigate("/");
    return null;
  }

  const validateLoginForm = () => {
    const errors: { email?: string; password?: string } = {};
    
    if (!loginEmail) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      errors.email = "Invalid email format";
    }
    
    if (!loginPassword) {
      errors.password = "Password is required";
    }
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = () => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!registerName) {
      errors.name = "Name is required";
    }
    
    if (!registerEmail) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(registerEmail)) {
      errors.email = "Invalid email format";
    }
    
    if (!registerPassword) {
      errors.password = "Password is required";
    } else if (registerPassword.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== registerPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;
    
    const success = await login(loginEmail, loginPassword);
    if (success) {
      navigate("/");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;
    
    const success = await register(registerName, registerEmail, registerPassword);
    if (success) {
      navigate("/");
    }
  };

  const handleDemoLogin = async () => {
    const success = await login("demo@example.com", "password123");
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Heart className="h-12 w-12 text-doctalk-purple" />
        </div>
        
        <h1 className="text-center text-3xl font-bold font-gradient mb-2">DocTalk</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Your trusted women's health companion
        </p>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {activeTab === "login" ? "Sign In" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login"
                ? "Sign in to access your DocTalk account"
                : "Join DocTalk for personalized women's health support"}
            </CardDescription>
          </CardHeader>
          
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "register")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                    {loginErrors.email && (
                      <p className="text-xs text-red-500">{loginErrors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <a
                        href="#"
                        className="text-xs text-doctalk-purple hover:text-doctalk-darkPurple"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Password reset functionality would be implemented in a production app.");
                        }}
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    {loginErrors.password && (
                      <p className="text-xs text-red-500">{loginErrors.password}</p>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-3">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                  >
                    Try Demo Account
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4 pt-5">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      placeholder="Jane Doe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                    />
                    {registerErrors.name && (
                      <p className="text-xs text-red-500">{registerErrors.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                    {registerErrors.email && (
                      <p className="text-xs text-red-500">{registerErrors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                    {registerErrors.password && (
                      <p className="text-xs text-red-500">{registerErrors.password}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {registerErrors.confirmPassword && (
                      <p className="text-xs text-red-500">{registerErrors.confirmPassword}</p>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
        
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          By using DocTalk, you agree to our{" "}
          <a href="#" className="text-doctalk-purple hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-doctalk-purple hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
