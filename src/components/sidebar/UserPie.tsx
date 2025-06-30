"use client"

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import Link from "next/link";

export function UserPie() {

    return (
        <div className="container px-2 flex h-14 w-full items-center justify-between">
            <Link href="/" className="font-bold text-lg">laynote</Link>
            <>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </>
        </div>
    )
}