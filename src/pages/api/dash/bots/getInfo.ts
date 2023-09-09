// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { DiscordProfile } from 'next-auth/providers/discord'
import { DISCORD_ID_REGEX } from '@/lib/utils/constants'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function GetInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  if (!id) return res.status(401).send({
    message: 'You have to provide an id'
  })

  if (!DISCORD_ID_REGEX.test(id as string)) return res.status(401).send({
    message: 'You must provide a valid id'
  })

  const fetch = await axios.get(`https://discord.com/api/v10/users/${id}`, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`
    }
  }).catch(() => null)

  if (!fetch?.data) return res.status(404).send({
    message: 'No bot information found'
  })
  
  const data  = fetch.data as DiscordProfile 
  if (!data.bot) return res.status(404).send({
    message: 'No bot information found'
  }) 

  if (data.avatar) data.avatar = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.${data.avatar.startsWith('a_') ? 'gif' : 'png'}`
  else data.avatar = `https://cdn.discordapp.com/embed/avatars/${parseInt(data.discriminator) % 5}.png`;

  return res.status(200).send({
    message: data
  })
}