import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { DISCORD_ID_REGEX } from '@/lib/utils/constants';
import BotModel from '@/models/Bot';
import { getDiferency } from '@/lib/utils/utils';

export default async function Vote(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session)
    return res.status(403).send({
      message: 'You must be logged in to use this endpoint.',
    });

  const { id } = req.query;
  if (!id)
    return res.status(401).send({
      message: 'You have to provide an id',
    });

  if (!DISCORD_ID_REGEX.test(id as string))
    return res.status(401).send({
      message: 'You must provide a valid id.',
    });

  const dataDB = await BotModel.findOne({ id });
  if (!dataDB)
    return res.status(404).send({
      message: 'The bot is not in the botlist.',
    });

  if (!dataDB.accepted)
    return res.status(200).send({
      message: 'You cannot vote for a bot that has not been accepted.',
    });

  const userVote = dataDB?.votes?.find((v) => v.userID === session.profile.id);
  if (userVote) {
    if (getDiferency(userVote.timestamp, 24))
      await BotModel.updateOne(
        { id },
        { $set: { 'votes.$[vote].timestamp': new Date().getTime() } },
        { arrayFilters: [{ 'vote.userID': session.profile.id }] }
      );
    else
      return res.status(200).send({
        message: `You have already voted for this bot, wait ${
          24 -
          Math.floor(
            (new Date().getTime() - userVote.timestamp) / (1000 * 60 * 60)
          )
        }h to vote again.`,
      });
  } else
    await BotModel.updateOne(
      { id },
      {
        $push: {
          votes: {
            userID: session.profile.id,
            timestamp: new Date().getTime(),
          },
        },
      }
    );

  return res.status(200).send({
    message: 'You voted correctly!',
  });
}
