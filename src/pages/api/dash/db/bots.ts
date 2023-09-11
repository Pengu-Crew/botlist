import { connectToDB } from "@/lib/utils/db";
import BotModel from "@/models/Bot";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Bots(
    _req: NextApiRequest,
    res: NextApiResponse
) {
    await connectToDB()

    const bots = await BotModel.find()
    return res.status(200).send({
        message: bots
    })
}