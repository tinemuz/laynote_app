"use client"

import {SignUpButton, useAuth} from "@clerk/nextjs"
import {useEffect} from "react"
import {NavBar} from "@/components/navbar"

export default function LandingPage() {
    const {isSignedIn, isLoaded} = useAuth()

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            window.location.href = "/notes"
        }
    }, [isLoaded, isSignedIn])

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500">Loading...</div>
            </div>
        )
    }

    if (isSignedIn) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500">Redirecting to notes...</div>
            </div>
        )
    }

    return (
        <>
            <NavBar/>
            <div className="container max-w-6xl mx-auto px-8 py-16">
                <div className="flex flex-col items-center text-center space-y-8">
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900">
                        Take notes.
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl">
                        A simple, fast note-taking app with rich text editing powered by Tiptap.
                    </p>
                    <div className="flex gap-4">
                        <SignUpButton>
                            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                Get Started
                            </button>
                        </SignUpButton>
                    </div>
                </div>
            </div>
        </>
    )
}


