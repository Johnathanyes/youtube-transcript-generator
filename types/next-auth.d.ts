// types/next-auth.d.ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      // Add other custom properties
    } & DefaultSession["user"]
  }

  // You can also extend other interfaces as needed
  interface User {
    // Add custom user properties
  }
}