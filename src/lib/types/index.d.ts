import NextAuth from 'next-auth';
import { DiscordProfile } from 'next-auth/providers/discord';

declare module 'next-auth' {
  interface Session {
    profile: DiscordUser;
  }
}

export type DiscordUser = {
  hexAccentColor: string;
  global_name?: string;
} & DiscordProfile;

export type BotAndOwner = {
  owner: DiscordProfile;
} & Bot;

export interface Bot {
  id: string;
  username: string;
  avatar: string;
  ownerID: string;
  discriminator: string;
  config: {
    longDescription: string;
    shortDescription: string;
    prefix: string;
    links: {
      linkDiscordServer?: string;
      linkWebSite?: string;
      linkGithub?: string;
      invite: string;
    };
  };
  tags?: string[];
  votes: {
    userID: string;
    timestamp: number;
  }[];
}
