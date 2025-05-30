"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import Link from "next/link";
import { usePageTransition } from "@/lib/context/page-transition-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";
import { auth, provider } from "@/lib/firebase"; // Import Firebase auth
import { signInWithPopup } from "firebase/auth";

export default function SignInPage() {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const redirectAttempted = useRef(false);
  const authCheckComplete = useRef(false);
  const { startTransition } = usePageTransition();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  // Robust authentication check for production
  useEffect(() => {
    // Only attach the listener if we haven't completed auth check
    if (!authCheckComplete.current) {
      console.log("Setting up auth listener");
      
      const unsubscribe = auth.onAuthStateChanged((user) => {
        console.log("Auth state changed:", user ? "user authenticated" : "no user");
        authCheckComplete.current = true;
        
        if (user && !redirectAttempted.current) {
          console.log("User is authenticated, preparing to redirect");
          // Set redirect flag first
          redirectAttempted.current = true;
          
          // Use timeout to ensure state is settled before navigation
          setTimeout(() => {
            console.log("Redirecting to:", redirectPath);
            try {
              startTransition(redirectPath);
            } catch (error) {
              console.error("Transition error:", error);
              // Fallback to direct router push if startTransition fails
              router.push(redirectPath);
            }
          }, 200);
        } else {
          console.log("No authenticated user or redirect already attempted");
          setIsAuthChecked(true);
          setIsLoading(false);
        }
      }, (error) => {
        console.error("Auth state error:", error);
        authCheckComplete.current = true;
        setIsLoading(false);
      });
      
      return () => {
        console.log("Unsubscribing from auth listener");
        unsubscribe();
      };
    }
  }, [redirectPath, startTransition, router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      console.log("Starting Google sign-in flow");
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user.uid);
      
      toast({
        title: "Welcome to SerenMind!",
        description: "You've been successfully signed in with Google.",
      });
      
      // Use timeout to ensure toast is shown before navigation
      setTimeout(() => {
        console.log("Redirecting after Google sign-in");
        startTransition(redirectPath);
      }, 300);
    } catch (error) {
      console.error("Google sign-in error:", error);
      setIsLoading(false);
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "An error occurred during Google authentication.",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Show loading state until authentication is checked
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{authMode === "signin" ? "Sign In" : "Sign Up"}</CardTitle>
          <CardDescription>Access your account easily</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            console.log("Form submitted, implement email/password auth here");
            // Add your email/password sign-in logic here
          }}>
            {authMode === "signup" && (
              <div className="mb-4">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-4">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility} 
                  className="absolute right-3 top-3"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">
              {authMode === "signin" ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          <Button onClick={handleGoogleSignIn} variant="outline" className="w-full mt-4">
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm w-full">
            {authMode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              type="button"
              onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")} 
              className="text-blue-500 hover:underline"
            >
              {authMode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}