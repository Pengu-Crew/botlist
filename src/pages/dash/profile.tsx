import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { BotData } from '@/lib/data/bots'

export default function profile() {
    const { data: session } = useSession()

    return (
        <div className="flex justify-center">
            {
                session && (
                    <div className="bg-Charcoal/10 w-11/12 p-5 m-5 rounded-lg">
                        <div className={`flex justify-between bg-[${session.profile.hexAccentColor}]/10 rounded-lg m-3 mb-8`}>
                            <div className='flex p-5'>
                                <Image className='rounded-lg' src={session.profile.avatar} width={100} height={100} alt={session.profile.username} />
                                <h1 className='text-LightGray/70 text-5xl font-extrabold p-5'>{session.profile.username}</h1>
                            </div>
                            <div className='flex items-center'>
                                <button className='bg-PaynesGray/20 rounded-lg text-left text-CadetGray font-semibold px-4 py-2 mr-5 block hover:bg-PaynesGray/10'>
                                    Add a bot
                                </button>
                            </div>
                        </div>
                        <div className='bg-Charcoal/10 rounded-lg m-3 p-5'>
                            <p className='text-PaynesGray text-4xl pl-10 font-bold'>Your bots</p>
                            <div>
                                {
                                    BotData.map((data) => {
                                        return (
                                            <div className="flex justify-start m-10 p-3 bg-Charcoal/10 rounded-lg" key={data.name}>
                                                <div className="pl-3 pr-10">
                                                    <Image className="rounded-lg min-w-[75px]" src={data.imageURL} alt={data.name} width={75} height={75} />
                                                </div>
                                                <div className="py-2">
                                                    <p className="text-CadetGray text-xl font-bold">{data.name}</p>
                                                    <p className="text-PaynesGray font-semibold ">{data.description}</p>
                                                </div>
                                                <div className='flex items-center'>
                                                    <button className='bg-red-Wenge/20 rounded-lg text-left text-red-Wenge font-semibold px-4 py-2 mr-5 block hover:bg-red-Wenge/10'>
                                                        Delete
                                                    </button>
                                                    <button className='bg-green-CambridgeBlue/20 rounded-lg text-left text-CadetGray font-semibold px-4 py-2 mr-2 block hover:bg-green-CambridgeBlue/10'>
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    )
}