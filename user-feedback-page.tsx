"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { toast, useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { useTheme } from "next-themes"

// Mock function for Google Drive integration
const saveToGoogleDrive = async (data: any, adminEmail: string) => {
  // This would be replaced with actual Google Drive API calls
  console.log(`Saving to Google Drive of ${adminEmail}:`, data)
  return new Promise((resolve) => setTimeout(resolve, 1000))
}

const ADMIN_USERS = [
  { name: "Admin 1", email: "admin1@example.com", driveLink: "https://drive.google.com/admin1" },
  { name: "Admin 2", email: "admin2@example.com", driveLink: "https://drive.google.com/admin2" },
]

export default function UserFeedbackPage() {
  const [progress, setProgress] = useState(0)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [emailError, setEmailError] = useState("")
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false)
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute("href") as string)
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
          })
        }
      })
    })
  }, [])

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    if (!regex.test(email)) {
      setEmailError("Please enter a valid Gmail address")
      return false
    }
    setEmailError("")
    return true
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const email = formData.get("email") as string

    if (!validateEmail(email)) {
      return
    }

    const data = Object.fromEntries(formData.entries())
    data.phoneNumber = phoneNumber // Add phone number to form data
    data.subscribeNewsletter = subscribeNewsletter // Add newsletter subscription status

    // Internal storage (this would typically be a database call)
    console.log("Storing internally:", data)

    try {
      // Save to both admin Google Drives
      await Promise.all(ADMIN_USERS.map((admin) => saveToGoogleDrive(data, admin.email)))

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your valuable feedback!",
      })

      // Reset form
      form.reset()
      setPhoneNumber("")
      setProgress(0)
      setSubscribeNewsletter(false)
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Error",
        description: "There was a problem submitting your feedback. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateProgress = () => {
    const inputs = document.querySelectorAll("input, textarea")
    const filledInputs = Array.from(inputs).filter(
      (input: HTMLInputElement | HTMLTextAreaElement) => input.value.trim() !== "",
    ).length
    setProgress((filledInputs / inputs.length) * 100)
  }

  React.useEffect(() => {
    const inputs = document.querySelectorAll("input, textarea")
    inputs.forEach((input) => input.addEventListener("input", updateProgress))
    return () => inputs.forEach((input) => input.removeEventListener("input", updateProgress))
  }, [])

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${theme === "dark" ? "from-gray-900 to-gray-800" : "from-blue-100 to-white"} py-12 px-4 sm:px-6 lg:px-8`}
    >
      <Card className={`max-w-4xl mx-auto shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white"}`}>
        <CardHeader className={`${theme === "dark" ? "bg-blue-900" : "bg-blue-500"} text-white rounded-t-lg`}>
          <CardTitle className="text-3xl font-bold text-center">
            Shape the Future of Social Media – We Need Your Feedback!
          </CardTitle>
          <CardDescription className="text-center mt-2 text-blue-100">
            Tell Us What You Need in Your Ideal Social Media Experience!
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
          <div className="flex justify-end mb-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              />
              <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>
          </div>
          <p className={`mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            We're developing an innovative new platform that will blend the best of communication, community engagement,
            and collaboration into one seamless experience. Your insights are invaluable in helping us build a platform
            that fits your needs and enhances your digital connections.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className={`mt-1 ${theme === "dark" ? "bg-gray-700 text-white" : ""}`}
                />
              </div>
              <div>
                <Label htmlFor="email">Gmail Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className={`mt-1 ${theme === "dark" ? "bg-gray-700 text-white" : ""}`}
                  onChange={(e) => validateEmail(e.target.value)}
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="US"
                value={phoneNumber}
                onChange={setPhoneNumber as (value: string) => void}
                className={`mt-1 ${theme === "dark" ? "bg-gray-700 text-white" : ""}`}
              />
            </div>

            <div>
              <Label htmlFor="important-features">
                What features do you think are most important for an online community platform?
              </Label>
              <Textarea
                id="important-features"
                name="important-features"
                placeholder="E.g., Instant messaging, voice/video chat, community discussions, content sharing, etc."
                className={`mt-1 resize-none ${theme === "dark" ? "bg-gray-700 text-white" : ""}`}
              />
            </div>

            <div>
              <Label htmlFor="communities">What kind of communities or groups would you want to be a part of?</Label>
              <Textarea
                id="communities"
                name="communities"
                placeholder="E.g., Hobbies, professional interests, gaming, self-improvement, etc."
                className={`mt-1 resize-none ${theme === "dark" ? "bg-gray-700 text-white" : ""}`}
              />
            </div>

            <div>
              <Label htmlFor="interactions">
                How would you like to interact with your friends or colleagues on this platform?
              </Label>
              <Textarea
                id="interactions"
                name="interactions"
                placeholder="E.g., One-on-one chat, group chats, video calls, forums, etc."
                className={`mt-1 resize-none ${theme === "dark" ? "bg-gray-700 text-white" : ""}`}
              />
            </div>

            <div>
              <Label htmlFor="privacy">What kind of privacy or control options would you expect?</Label>
              <Textarea
                id="privacy"
                name="privacy"
                placeholder="E.g., Private conversations, control over notifications, anonymous interactions, etc."
                className={`mt-1 resize-none ${theme === "dark" ? "bg-gray-700 text-white" : ""}`}
              />
            </div>

            <div>
              <Label htmlFor="ux">What user experience elements are important to you when using social media?</Label>
              <Textarea
                id="ux"
                name="ux"
                placeholder="E.g., Easy navigation, fast loading times, customizable themes, accessible design, etc."
                className={`mt-1 resize-none ${theme === "dark" ? "bg-gray-700 text-white" : ""}`}
              />
            </div>

            <div>
              <Label htmlFor="content">
                What kind of content would you like to create, share, or engage with on the platform?
              </Label>
              <Textarea
                id="content"
                name="content"
                placeholder="E.g., Text posts, images, videos, live streaming, discussions, etc."
                className={`mt-1 resize-none ${theme === "dark" ? "bg-gray-700 text-white" : ""}`}
              />
            </div>

            <div>
              <Label>How important is the ability to connect with people from around the world to you?</Label>
              <RadioGroup defaultValue="medium" name="global-importance" className="flex space-x-4 mt-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="importance-low" />
                  <Label htmlFor="importance-low">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="importance-medium" />
                  <Label htmlFor="importance-medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="importance-high" />
                  <Label htmlFor="importance-high">High</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="organization">
                Would you like to see features that help in organizing or managing your communities or groups?
              </Label>
              <Textarea
                id="organization"
                name="organization"
                placeholder="E.g., Event scheduling, admin tools, moderation features, etc."
                className={`mt-1 resize-none ${theme === "dark" ? "bg-gray-700 text-white" : ""}`}
              />
            </div>

            <div>
              <Label htmlFor="motivation">What motivates you to stay active and engaged in a community?</Label>
              <Textarea
                id="motivation"
                name="motivation"
                placeholder="E.g., Rewards, recognition, challenges, meaningful interactions, etc."
                className={`mt-1 resize-none ${theme === "dark" ? "bg-gray-700 text-white" : ""}`}
              />
            </div>

            <div>
              <Label htmlFor="additional">
                Is there anything else you would like to see or expect from this platform?
              </Label>
              <Textarea
                id="additional"
                name="additional"
                placeholder="Any additional comments, features, or suggestions that you believe would improve your experience."
                className={`mt-1 resize-none ${theme === "dark" ? "bg-gray-700 text-white" : ""}`}
              />
            </div>

            <div>
              <Label>How satisfied are you with current social media platforms?</Label>
              <Slider defaultValue={[50]} max={100} step={1} name="satisfaction" className="mt-2" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="subscribe"
                checked={subscribeNewsletter}
                onCheckedChange={(checked) => setSubscribeNewsletter(checked as boolean)}
              />
              <Label htmlFor="subscribe">Subscribe to our email newsletter for updates</Label>
            </div>

            <CardFooter className="flex flex-col items-center mt-6">
              <p className={`mb-4 text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Your feedback will directly influence the future of this platform! We want to create something that you
                love, so please share your thoughts, ideas, and needs.
              </p>
              <Button
                type="submit"
                className={`w-full sm:w-auto ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
              >
                Submit Your Feedback
              </Button>
              <div className="w-full mt-4">
                <Label>Survey Progress</Label>
                <Progress value={progress} className="w-full mt-2" />
              </div>
              <div className="w-full flex justify-end mt-4">
                <div
                  className={`${theme === "dark" ? "bg-blue-800" : "bg-blue-600"} text-white px-4 py-2 rounded-lg text-sm font-semibold`}
                >
                  MADE IN ALFinIT
                </div>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}

