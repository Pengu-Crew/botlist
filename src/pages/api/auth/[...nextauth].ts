import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
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
        session({ session, token }: { session: Session, token: JWT}) {
            session.profile = token?.profile as DiscordProfile
            return session
        }
    },
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            profile(profile: DiscordProfile) {
                if (!profile.avatar) profile.avatar = `https://cdn.discordapp.com/embed/avatars/${parseInt(profile.discriminator) % 5}.png`;
                else profile.avatar = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${profile.avatar.startsWith('a_') ? 'gif' : 'png'}`

                return profile
            }
        })
    ],
    secret: process.env.SECRET
})