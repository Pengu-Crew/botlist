import { getAvatar } from '@/lib/utils/discord';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { DiscordProfile } from 'next-auth/providers/discord';

export default async function User(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id)
    return res.status(401).send({
      message: 'You have to provide an id',
    });

  const fetch = await axios
    .get(`https://discord.com/api/v10/users/${id}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`,
      },
    })
    .catch(() => null);

  if (!fetch?.data)
    return res.status(404).send({
      message: 'No bot information found',
    });

  const data = fetch.data as DiscordProfile;
  data.avatar = getAvatar({
    id: data.id,
    discriminator: data.discriminator,
    avatar: data.avatar,
  });

  return res.status(200).send({
    message: data,
  });
}
