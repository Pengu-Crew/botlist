import NextAuth from "next-auth"
import { DiscordProfile } from 'next-auth/providers/discord'

declare module "next-auth" {
  interface Session {
    profile: DiscordProfile
  }
}