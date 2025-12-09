import NextAuth from "next-auth/next"
import { getServerSession } from "next-auth/next"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("AUTH ATTEMPT:", { email: credentials?.email, hasPassword: !!credentials?.password })
        if (!credentials?.email || !credentials?.password) {
          console.log("MISSING CREDENTIALS")
          return null
        }

        const user = await prisma.user.findUnique({ where: { email: credentials.email as string } })
        console.log("USER FOUND:", !!user, user?.email)
        if (!user) {
          console.log("USER NOT FOUND")
          return null
        }

        const passwordMatch = credentials.password === user.password
        console.log("PASSWORD MATCH:", passwordMatch)
        if (!passwordMatch) {
          console.log("PASSWORD MISMATCH")
          return null
        }

        console.log("AUTH SUCCESS FOR:", user.email)
        return user;
      }
    })
  ],
  session: { strategy: "jwt" as const },
  pages: { 
    signIn: "/auth/login",
    error: "/auth/login" // Redirect auth errors back to login page
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = (user as any).id
        token.email = (user as any).email
        token.name = (user as any).name
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = (token as any).id as string
        session.user.email = (token as any).email as string
        session.user.name = (token as any).name as string
      }
      return session
    }
  }
}

// NextAuth handler for the App Router
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// Callable auth helper for server components/pages
export async function auth() {
  return getServerSession(authOptions)
}

export const signIn = nextAuthSignIn
export const signOut = nextAuthSignOut

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}
