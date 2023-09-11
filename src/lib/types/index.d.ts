import NextAuth from 'next-auth'
import { DiscordProfile } from 'next-auth/providers/discord'

declare module 'next-auth' {
  interface Session {
    profile: DiscordUser
  }
}

export type DiscordUser = {
  hexAccentColor: string
} & DiscordProfile

export interface Bot {
  id: string
  username: string
  avatar: string
  ownerID: string
  config: {
    longDescription: string
    shortDescription: string
    prefix: string
    links: {
      linkDiscordServer?: string
      linkWebSite?: string
      linkGithub?: string
    }
  }
  tags?: string[]
  votes: number
}
