import type { Metadata, Viewport } from "next"
import { Inter, Cinzel, Outfit, Crimson_Pro } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import PageTransition from "@/components/PageTransition"
import ConditionalLayout from "@/components/ConditionalLayout"
import AuthProvider from "@/components/AuthProvider"

const inter = Inter({ subsets: ["latin"] })
const cinzel = Cinzel({ 
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
})
const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})
const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Brotherhood 2035",
  description: "Your elite command center for total life optimization",
  // Ensure a proper base URL is provided for Open Graph and social image resolution.
  // Use NEXT_PUBLIC_SITE_URL in env or fallback to localhost for local builds.
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : new URL('http://localhost:3000'),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Brotherhood 2035",
    description: "Your elite command center for total life optimization",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Brotherhood 2035 - Elite Life Optimization Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brotherhood 2035",
    description: "Your elite command center for total life optimization",
    images: ["/og-image.jpg"],
  },
}

export const viewport: Viewport = {
  themeColor: "#0B0D10",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${cinzel.variable} ${outfit.variable} ${crimsonPro.variable}`}>
        <AuthProvider>
          <ConditionalLayout>
            <PageTransition>{children}</PageTransition>
          </ConditionalLayout>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'hsl(222.2 84% 6%)',
                color: 'hsl(210 40% 98%)',
                border: '1px solid hsl(217.2 32.6% 17.5%)',
              },
              success: {
                iconTheme: {
                  primary: 'hsl(45 93% 47%)',
                  secondary: 'hsl(222.2 84% 6%)',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
