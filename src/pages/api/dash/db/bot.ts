import { getAvatar } from '@/lib/utils/discord';
import axios from 'axios';
import { connectToDB } from '@/lib/utils/db';
import BotModel from '@/models/Bot';
import { NextApiRequest, NextApiResponse } from 'next';
import { DiscordProfile } from 'next-auth/providers/discord';
import { BotAndOwner } from '@/lib/types';

export default async function BotDiscord(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query
    if (!id) return res.status(401).send({
      message: 'You have to provide an id'
    })
    
    await connectToDB()
  
    const bot = await BotModel.findOne({ id })
    if (!bot) return res.status(200).send({
        message: 'No bot found'
    })
    const fetch = await axios.get(`https://discord.com/api/v10/users/${bot.ownerID}`, {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`
        }
      }).catch(() => null)

    if (fetch?.data) {
        const data  = fetch.data as DiscordProfile 
        data.avatar = getAvatar({ id: data.id, discriminator: data.discriminator, avatar: data.avatar })

        const botJson = bot.toJSON() as BotAndOwner
        botJson.owner = data

        return res.status(200).send({
            message: botJson
        })
    }
    return res.status(200).send({
        message: bot
    })
}

