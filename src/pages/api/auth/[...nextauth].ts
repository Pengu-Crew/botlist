import { DiscordUser } from '@/lib/types';
import { getAvatar } from '@/lib/utils/discord';
import NextAuth from 'next-auth/next'
import DiscordProvider, { DiscordProfile } from 'next-auth/providers/discord'

export default NextAuth({
    callbacks: {
        jwt({ token, user: raw_user, account}) {
            const user = raw_user as unknown as DiscordProfile;
            if (!user) return token
    
            token.profile = user
            token.accessToken = account?.access_token as string
    
            return token
        },
        session({ session, token }) {
            session.profile = token?.profile as DiscordUser
            return session
        }
    },
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            profile(profile: DiscordProfile) {
                profile.avatar = getAvatar({ id: profile.id, discriminator: profile.discriminator, avatar: profile.avatar })

                if (profile.accent_color) profile.hexAccentColor = `#${profile.accent_color.toString(16)}`
                return profile
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET
})

