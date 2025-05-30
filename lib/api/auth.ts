// This file contains the authentication API functions
// In a real implementation, these would interact with a backend service

export interface User {
  id: string
  name: string
  email: string
  isAnonymous: boolean
  photoURL?: string
}

// Simulated delay for API calls
const simulateApiDelay = () => new Promise((resolve) => setTimeout(resolve, 1000))

// Sign in with email and password
export async function signIn(email: string, password: string, rememberMe = false): Promise<User> {
  await simulateApiDelay()

  // In a real implementation, this would validate credentials with a backend
  if (!email || !password) {
    throw new Error("Email and password are required")
  }

  // For demo purposes, we'll create a mock user
  return {
    id: "user-" + Math.random().toString(36).substring(2, 9),
    name: email.split("@")[0],
    email,
    isAnonymous: false,
  }
}

// Sign up with email, password, and name
export async function signUp(email: string, password: string, name: string): Promise<User> {
  await simulateApiDelay()

  // In a real implementation, this would create a new user in the backend
  if (!email || !password || !name) {
    throw new Error("Email, password, and name are required")
  }

  // For demo purposes, we'll create a mock user
  return {
    id: "user-" + Math.random().toString(36).substring(2, 9),
    name,
    email,
    isAnonymous: false,
  }
}

// Sign in with Google
export async function signInWithGoogle(): Promise<User> {
  await simulateApiDelay()

  // In a real implementation, this would redirect to Google OAuth
  // For demo purposes, we'll create a mock user
  return {
    id: "google-" + Math.random().toString(36).substring(2, 9),
    name: "Google User",
    email: "user@gmail.com",
    isAnonymous: false,
    photoURL: "/placeholder.svg?height=40&width=40",
  }
}

// Sign in anonymously
export async function signInAnonymously(): Promise<User> {
  await simulateApiDelay()

  // In a real implementation, this would create an anonymous session
  // For demo purposes, we'll create a mock anonymous user
  return {
    id: "anon-" + Math.random().toString(36).substring(2, 9),
    name: "Anonymous User",
    email: "",
    isAnonymous: true,
  }
}

// Sign out
export async function signOut(): Promise<void> {
  await simulateApiDelay()

  // In a real implementation, this would invalidate the session
  return
}