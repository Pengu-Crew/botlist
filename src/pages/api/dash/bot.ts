import { DiscordProfile } from 'next-auth/providers/discord'
import { DISCORD_ID_REGEX } from '@/lib/utils/constants'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Bot } from '@/lib/types'
import { connectToDB } from '@/lib/utils/db'
import BotModel from '@/models/Bot'
import { getAvatar } from '@/lib/utils/discord'
import { getSession } from 'next-auth/react'
import authOptions from '../auth/[...nextauth]'
import { Session, getServerSession } from 'next-auth'

export default async function Bot(
  req: NextApiRequest,
  res: NextApiResponse
) {

  let session: Session | null

  if (req.method === 'POST') {
    if (!await getServerSession(req, res, authOptions)) return res.status(403).send({
      message: 'You must be logged in to use this endpoint.'
    })
  } else {
    const sessionUser = await getSession({ req });
    if (sessionUser) session = sessionUser
    else return res.status(403).send({
        message: 'You must be logged in to use this endpoint.'
    })
  }

   await connectToDB()

    switch(req.method) {
        case 'POST': {
            if (!req.body) return res.status(401).send({
                message: 'It seems that you forgot to send some information.'
            })
    
            const { data } = req.body as { data: Bot }
            if (!data) return res.status(401).send({
                message: 'It seems that you forgot to send some information.'
            })
    
            const dataDB = await BotModel.findOne({ id: data.id })
            if (dataDB) return res.status(406).send({
                message: 'The bot is already in the botlist!'
            })
            
            await BotModel.create(data)

            return res.status(200).send({
                message: 'The information was saved correctly!'
            })
        }

        case 'GET': {
            const { id } = req.query
            if (!id) return res.status(401).send({
              message: 'You have to provide an id'
            })
          
            if (!DISCORD_ID_REGEX.test(id as string)) return res.status(401).send({
              message: 'You must provide a valid id'
            })
            
            const dataDB = await BotModel.findOne({ id })
            if (dataDB) return res.status(406).send({
                message: 'The bot is already in the botlist!'
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
              message: 'The id is not from a bot'
            }) 

            data.avatar = getAvatar({ id: data.id, discriminator: data.discriminator, avatar: data.avatar })

            return res.status(200).send({
              message: data
            })
        }

        case 'DELETE': {
          const { id } = req.query
          if (!id) return res.status(401).send({
            message: 'You have to provide an id'
          })
        
          if (!DISCORD_ID_REGEX.test(id as string)) return res.status(401).send({
            message: 'You must provide a valid id'
          })
          
          const dataDB = await BotModel.findOne({ id })
          if (!dataDB) return res.status(406).send({
              message: 'The bot is not in the botlist!'
          })

          if (session!.profile.id !== dataDB.ownerID) return res.status(403).send({
            message: 'Apparently that bot is not yours'
          })

          await BotModel.deleteOne({ id })

          return res.status(200).send({
            message: 'Bot successfully removed'
          })
        }

        default : {
            return res.status(405).send({
                message: 'Method not allowed'
            })
        }
    }
}

