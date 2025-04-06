
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("doctalk-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Always allow the specific email to login with any password for testing
      if (email === "janhvimandhan@gmail.com") {
        const user = { id: "user-special", name: "Janhvi Mandhan", email };
        setUser(user);
        localStorage.setItem("doctalk-user", JSON.stringify(user));
        toast({
          title: "Login successful",
          description: "Welcome back to DocTalk!",
        });
        return true;
      }
      
      // Regular demo user
      if (email === "demo@example.com" && password === "password123") {
        const user = { id: "user-1", name: "Demo User", email };
        setUser(user);
        localStorage.setItem("doctalk-user", JSON.stringify(user));
        toast({
          title: "Login successful",
          description: "Welcome back to DocTalk!",
        });
        return true;
      } else {
        // Check if there's a saved user with this email
        const storedUsers = JSON.parse(localStorage.getItem("doctalk-users") || "[]");
        const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password);
        
        if (foundUser) {
          const user = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
          setUser(user);
          localStorage.setItem("doctalk-user", JSON.stringify(user));
          toast({
            title: "Login successful",
            description: "Welcome back to DocTalk!",
          });
          return true;
        }
        
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password",
        });
        return false;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An unexpected error occurred",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const storedUsers = JSON.parse(localStorage.getItem("doctalk-users") || "[]");
      if (storedUsers.some((u: any) => u.email === email)) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "Email already in use",
        });
        return false;
      }
      
      // Save new user
      const newUser = { 
        id: `user-${Date.now()}`, 
        name, 
        email, 
        password // In a real app, this would be hashed
      };
      
      storedUsers.push(newUser);
      localStorage.setItem("doctalk-users", JSON.stringify(storedUsers));
      
      // Auto login
      const user = { id: newUser.id, name: newUser.name, email: newUser.email };
      setUser(user);
      localStorage.setItem("doctalk-user", JSON.stringify(user));
      
      toast({
        title: "Registration successful",
        description: "Welcome to DocTalk!",
      });
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration error",
        description: "An unexpected error occurred",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("doctalk-user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
