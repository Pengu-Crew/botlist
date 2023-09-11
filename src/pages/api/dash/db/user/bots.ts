import { connectToDB } from "@/lib/utils/db";
import BotModel from "@/models/Bot";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function UserBots(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession({ req });
    if (!session) return res.status(403).send({
        message: 'You must be logged in to use this endpoint.'
    })
    
    await connectToDB()

    const bots = await BotModel.find({ ownerID: session.profile.id })
    return res.status(200).send({
        message: bots
    })
}