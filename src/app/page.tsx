"use client"

import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { NavBar } from "@/components/navbar"

export default function LandingPage() {
    const { isSignedIn, isLoaded } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.push("/notes")
        }
    }, [isLoaded, isSignedIn, router])

    return (
        <>
            <NavBar />
            <div className="container max-w-6xl mx-auto px-8 py-16">
                <div className="flex flex-col items-center text-center space-y-8">
                    <h1 className="text-5xl font-bold tracking-tight">
                        Take notes.
                    </h1>
                    <div className="flex gap-4">
                        {!isLoaded ? (
                            <>
                                <div className="w-32 h-12 bg-stone-100 rounded-full animate-pulse"></div>
                            </>
                        ) : (
                            <>
                                <SignUpButton>
                                    <button className="bg-stone-900 text-white px-6 py-3 rounded-full font-medium hover:bg-stone-800 transition-colors">
                                        Get Started
                                    </button>
                                </SignUpButton>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}


