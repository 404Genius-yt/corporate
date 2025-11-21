"use client"

import { useState } from "react"
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [verifying, setVerifying] = useState(false)

  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [generalError, setGeneralError] = useState("") // <-- signup error
  const [verifyError, setVerifyError] = useState("")   // <-- verify error

  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  // validate email
  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(value)) setEmailError("Invalid email format")
    else setEmailError("")
  }

  // validate password
  const validatePassword = (value: string) => {
    if (value.length < 8) setPasswordError("Password must be at least 8 characters")
    else setPasswordError("")
  }

  // ---------------- HANDLE SIGNUP ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError("") // clear error
    setIsLoading(true)

    validateEmail(emailAddress)
    validatePassword(password)

    if (emailError || passwordError) {
      setIsLoading(false)
      return
    }

    if (!isLoaded) return

    try {
      await signUp.create({
        username,
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      })

      setVerifying(true)
      setIsLoading(false)
    } catch (err: any) {
      console.log(err)

      // --- show clerk error ---
      setGeneralError(err?.errors?.[0]?.message || "Something went wrong")

      setIsLoading(false)
    }
  }

  // ---------------- HANDLE VERIFY ----------------
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerifyError("") // clear
    setIsLoading(true)

    try {
      if (!signUp) throw new Error("SignUp object is not loaded")
      const attempt = await signUp.attemptEmailAddressVerification({ code })

      if (attempt.status === "complete") {
        if (!setActive) throw new Error("setActive function is not loaded")
        await setActive({ session: attempt.createdSessionId })
        router.push("/")
      }
    } catch (err: any) {
      console.log(err)

      // Show the specific Clerk error if available, otherwise generic message
      setVerifyError(err?.errors?.[0]?.message || "Invalid code")

      setIsLoading(false)
      return
    }

    setIsLoading(false)
  }

  return (
    <div className="grid w-full h-full place-items-center bg-[#FAFAFA] px-4">

      {/* ---------------- SIGNUP ---------------- */}
      {!verifying && (
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 
          shadow-lg ring-1 ring-inset ring-[#00B4D8]/30 sm:w-96 sm:px-8"
        >
          <h1 className="text-center text-xl font-semibold text-[#222]">
            Create an account
          </h1>

          {/* username */}
          <div>
            <label className="text-sm text-[#222]">Username</label>
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md bg-[#FAFAFA] px-3 py-2 
              ring-1 ring-[#00B4D8]/40 focus:ring-[#0077B6]"
            />
          </div>

          {/* email */}
          <div>
            <label className="text-sm text-[#222]">Email</label>
            <input
              required
              value={emailAddress}
              onChange={(e) => {
                setEmailAddress(e.target.value)
                validateEmail(e.target.value)
              }}
              className="w-full rounded-md bg-[#FAFAFA] px-3 py-2 
              ring-1 ring-[#00B4D8]/40 focus:ring-[#0077B6]"
            />
            {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
          </div>

          {/* password */}
          <div>
            <label className="text-sm text-[#222]">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                validatePassword(e.target.value)
              }}
              className="w-full rounded-md bg-[#FAFAFA] px-3 py-2 
              ring-1 ring-[#00B4D8]/40 focus:ring-[#0077B6]"
            />
            {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
          </div>

          {/* signup error */}
          {generalError && (
            <p className="text-xs text-red-500">{generalError}</p>
          )}

          {/* button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-[#0077B6] py-2 text-white disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-[#222]/60">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-[#0077B6] underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      )}

      {/* ---------------- VERIFY ---------------- */}
      {verifying && (
        <form
          onSubmit={handleVerify}
          className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 
          shadow-lg ring-1 ring-inset ring-[#00B4D8]/30 sm:w-96 sm:px-8"
        >
          <h1 className="text-center text-xl font-semibold text-[#222]">
            Verify email
          </h1>

          {/* code */}
          <div>
            <label className="text-sm text-[#222]">Email code</label>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-md bg-[#FAFAFA] px-3 py-2 
              ring-1 ring-[#00B4D8]/40 focus:ring-[#0077B6]"
            />
          </div>

          {/* verify error */}
          {verifyError && (
            <p className="text-sm text-red-500">{verifyError}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-[#0077B6] py-2 text-white disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Finish registration"}
          </button>
        </form>
      )}
    </div>
  )
}
