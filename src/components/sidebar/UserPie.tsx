"use client"

import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs"
import Link from "next/link";

export function UserPie() {

    return (
        <div className="container bg-gray-200 rounded-full p-2 flex w-full items-center justify-between">
            <Link href="/" className="pl-1">laynote</Link>
            <>
                <SignedOut>
                    <SignInButton/>
                </SignedOut>
                <SignedIn>
                    <UserButton/>
                </SignedIn>
            </>
        </div>
    )
}