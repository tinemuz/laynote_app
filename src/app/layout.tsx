import {type Metadata} from 'next'
import {ClerkProvider,} from '@clerk/nextjs'
import {Geist, Geist_Mono} from 'next/font/google'
import './globals.css'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Laynote - Simple Note Taking',
    description: 'A simple, fast note-taking app with rich text editing',
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider>
            <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <body className={"flex w-full flex-col items-center"}>
            {children}

            </body>
            </html>
        </ClerkProvider>
    )
}