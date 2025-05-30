"use client"

import { Slider } from "@/components/ui/slider"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, User, Mail, Lock, Moon, Sun, LogOut, Home, Send, BarChart3, Music } from "lucide-react"
import Link from "next/link"
import { usePageTransition } from "@/lib/context/page-transition-context"
import { useAuth } from "@/lib/context/auth-context"
import { useTheme } from "next-themes"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("account")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { startTransition } = usePageTransition()
  const { user, signOut, isLoading } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  // Form state
  const [name, setName] = useState(user?.displayName || "")
  const [email, setEmail] = useState(user?.email || "")
  const [notifications, setNotifications] = useState({
    email: true,
    app: true,
    moodReminders: true,
    weeklyReport: true,
    newFeatures: false,
  })

  const handleSaveProfile = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    })

    setIsEditing(false)
    setIsSaving(false)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })
      startTransition("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] dark:bg-gray-900">
        <LoadingSpinner size="lg" className="text-[#6A9FB5] mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900 text-[#333333] dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-[#6A9FB5]/10 py-4 px-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-[#F5E1DA]/50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => startTransition("/dashboard")}
            >
              <ArrowLeft size={20} className="text-[#6A9FB5]" />
            </Button>
            <h1 className="font-semibold text-xl">Profile Settings</h1>
          </div>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-[#6A9FB5]/30 text-[#6A9FB5] hover:bg-[#F5E1DA]/30 hover:text-[#6A9FB5] transition-colors"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-[#6A9FB5] hover:bg-[#A3D9A5] text-white transition-colors"
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="bg-[#6A9FB5] hover:bg-[#A3D9A5] text-white transition-colors"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <main className="container mx-auto px-4 py-8 max-w-5xl pb-20">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Summary Card */}
            <Card className="md:w-1/3 border-[#6A9FB5]/20 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage
                      src={user?.photoURL || "/placeholder.svg?height=96&width=96"}
                      alt={user?.displayName || "User"}
                    />
                    <AvatarFallback className="bg-[#6A9FB5] text-white text-xl">
                      {user?.displayName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold mb-1">{user?.displayName || "Anonymous User"}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{user?.email || "No email provided"}</p>

                  <div className="w-full space-y-4 mt-4">
                    <div className="flex justify-between items-center p-3 bg-[#F5E1DA]/30 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm font-medium">Member Since</span>
                      <span className="text-sm">June 2023</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#A3D9A5]/20 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm font-medium">Mood Entries</span>
                      <span className="text-sm">42</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#6A9FB5]/20 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm font-medium">Chat Sessions</span>
                      <span className="text-sm">15</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-6 border-[#6A9FB5]/30 text-[#6A9FB5] hover:bg-[#F5E1DA]/30 hover:text-[#6A9FB5] transition-colors"
                    onClick={handleSignOut}
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Settings Tabs */}
            <div className="flex-1">
              <Tabs defaultValue="account" onValueChange={setActiveTab}>
                <TabsList className="bg-[#F5E1DA]/30 dark:bg-gray-800 w-full justify-start mb-6">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy</TabsTrigger>
                </TabsList>

                <TabsContent value="account" className="space-y-4">
                  <Card className="border-[#6A9FB5]/20 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <div className="relative">
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditing}
                            className="pl-10 border-[#6A9FB5]/30 focus-visible:ring-[#6A9FB5]"
                          />
                          <User
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditing}
                            className="pl-10 border-[#6A9FB5]/30 focus-visible:ring-[#6A9FB5]"
                          />
                          <Mail
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type="password"
                            value="••••••••"
                            disabled
                            className="pl-10 border-[#6A9FB5]/30 focus-visible:ring-[#6A9FB5]"
                          />
                          <Lock
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                        </div>
                        <Button
                          variant="link"
                          className="text-[#6A9FB5] p-0 h-auto text-sm"
                          onClick={() => {
                            toast({
                              title: "Password Reset",
                              description: "Password reset instructions have been sent to your email.",
                            })
                          }}
                        >
                          Change Password
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-[#6A9FB5]/20 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle>Data Management</CardTitle>
                      <CardDescription>Manage your personal data</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Export Your Data</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Download all your data in JSON format
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="border-[#6A9FB5]/30 text-[#6A9FB5] hover:bg-[#F5E1DA]/30 hover:text-[#6A9FB5] transition-colors"
                          onClick={() => {
                            toast({
                              title: "Data Export Started",
                              description: "Your data is being prepared for download.",
                            })
                          }}
                        >
                          Export
                        </Button>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-[#6A9FB5]/10">
                        <div>
                          <h4 className="font-medium text-destructive">Delete Account</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            toast({
                              title: "Account Deletion",
                              description: "Please contact support to delete your account.",
                              variant: "destructive",
                            })
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                  <Card className="border-[#6A9FB5]/20 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Manage how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                          </div>
                          <Switch
                            checked={notifications.email}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">App Notifications</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Receive in-app notifications</p>
                          </div>
                          <Switch
                            checked={notifications.app}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, app: checked })}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#6A9FB5]/10 space-y-4">
                        <h4 className="font-medium">Notification Types</h4>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Daily Mood Reminders</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Reminders to check in with your mood
                            </p>
                          </div>
                          <Switch
                            checked={notifications.moodReminders}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, moodReminders: checked })
                            }
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Weekly Progress Report</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Summary of your weekly mood patterns
                            </p>
                          </div>
                          <Switch
                            checked={notifications.weeklyReport}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })}
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">New Features & Updates</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Information about new app features
                            </p>
                          </div>
                          <Switch
                            checked={notifications.newFeatures}
                            onCheckedChange={(checked) => setNotifications({ ...notifications, newFeatures: checked })}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-4">
                  <Card className="border-[#6A9FB5]/20 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle>Appearance Settings</CardTitle>
                      <CardDescription>Customize how SerenMind looks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Theme</h4>

                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            variant="outline"
                            className={`h-auto py-6 flex flex-col items-center justify-center gap-2 rounded-xl ${theme === "light" ? "border-[#6A9FB5] bg-[#F5E1DA]/30" : "border-[#6A9FB5]/30"}`}
                            onClick={() => setTheme("light")}
                          >
                            <Sun size={24} className={theme === "light" ? "text-[#6A9FB5]" : ""} />
                            <span>Light Mode</span>
                          </Button>

                          <Button
                            variant="outline"
                            className={`h-auto py-6 flex flex-col items-center justify-center gap-2 rounded-xl ${theme === "dark" ? "border-[#6A9FB5] bg-[#6A9FB5]/20" : "border-[#6A9FB5]/30"}`}
                            onClick={() => setTheme("dark")}
                          >
                            <Moon size={24} className={theme === "dark" ? "text-[#6A9FB5]" : ""} />
                            <span>Dark Mode</span>
                          </Button>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#6A9FB5]/10 space-y-4">
                        <h4 className="font-medium">Voice Assistant Settings</h4>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Enable Voice Responses</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">AI responses will be read aloud</p>
                          </div>
                          <Switch
                            checked={true}
                            onCheckedChange={(checked) => {
                              toast({
                                title: checked ? "Voice Enabled" : "Voice Disabled",
                                description: checked
                                  ? "AI responses will be read aloud."
                                  : "AI responses will not be read aloud.",
                              })
                            }}
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Voice Speed</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Adjust how fast the voice speaks</p>
                          </div>
                          <div className="w-32">
                            <Slider defaultValue={[0.9]} max={1.5} min={0.5} step={0.1} className="w-full" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-4">
                  <Card className="border-[#6A9FB5]/20 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                      <CardDescription>Manage your privacy preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Data Collection</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Allow anonymous data collection to improve the app
                            </p>
                          </div>
                          <Switch
                            checked={true}
                            onCheckedChange={(checked) => {
                              toast({
                                title: "Setting Updated",
                                description: "Your privacy preference has been saved.",
                              })
                            }}
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Profile Visibility</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Make your profile visible to other users
                            </p>
                          </div>
                          <Switch
                            checked={false}
                            onCheckedChange={(checked) => {
                              toast({
                                title: "Setting Updated",
                                description: "Your profile visibility preference has been saved.",
                              })
                            }}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#6A9FB5]/10">
                        <Button
                          variant="link"
                          className="text-[#6A9FB5] p-0 h-auto text-sm"
                          onClick={() => {
                            toast({
                              title: "Privacy Policy",
                              description: "Opening privacy policy in a new tab.",
                            })
                          }}
                        >
                          View Privacy Policy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </ScrollArea>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-[#6A9FB5]/10 py-2 z-10">
        <div className="flex justify-around">
          <Link
            href="/dashboard"
            className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-[#6A9FB5] dark:hover:text-[#6A9FB5]"
            onClick={(e) => {
              e.preventDefault()
              startTransition("/dashboard")
            }}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            href="/chat"
            className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-[#6A9FB5] dark:hover:text-[#6A9FB5]"
            onClick={(e) => {
              e.preventDefault()
              startTransition("/chat")
            }}
          >
            <Send size={20} />
            <span className="text-xs mt-1">Chat</span>
          </Link>
          <Link
            href="/mood-tracker"
            className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-[#6A9FB5] dark:hover:text-[#6A9FB5]"
            onClick={(e) => {
              e.preventDefault()
              startTransition("/mood-tracker")
            }}
          >
            <BarChart3 size={20} />
            <span className="text-xs mt-1">Mood</span>
          </Link>
          <Link
            href="/music-therapy"
            className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-[#6A9FB5] dark:hover:text-[#6A9FB5]"
            onClick={(e) => {
              e.preventDefault()
              startTransition("/music-therapy")
            }}
          >
            <Music size={20} />
            <span className="text-xs mt-1">Therapy</span>
          </Link>
        </div>
      </div>
    </div>
  )
}