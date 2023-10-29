import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Bot } from '@/lib/types'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { hexToRgba } from '@/lib/utils/utils'

export default function Profile() {
    const [bots, setBots] = useState<Bot[]>()
    const { data: session } = useSession()
    
    function onDeleteBot(id: string) {
        axios.delete(`/api/dash/bot?id=${id}`).then((data) => {
            if (data.status === 200) setTimeout(() => window.location.reload(), 3000)
        })
    }

    useEffect(() => {
      axios.get('/api/dash/db/user/bots').then(({ data }) => setBots(data.message)).catch(() => setBots(undefined))
    }, [])
    
    return (
        <div className='flex justify-center'>
            {
                session && (
                    <div className='bg-surface2/10 w-11/12 p-5 m-5 rounded-lg'>
                        <div style={{ backgroundColor: hexToRgba(session.profile.hexAccentColor, 0.1) }} className={`flex justify-between rounded-lg m-3 mb-8`}>
                            <div className='flex p-5'>
                                <Image className='rounded-lg' src={session.profile.avatar} width={100} height={100} alt={session.profile.username} />
                                <h1 className='text-subtext0 text-5xl font-extrabold p-5'>{session.profile.global_name ??session.profile.username}</h1>
                            </div>
                            <div className='flex items-center'>
                                <Link href='/dash/bots/add'>
                                    <button className='bg-surface2/20 rounded-lg text-left text-subtext0/75 font-semibold px-4 py-2 mr-5 block hover:bg-PaynesGray/10'>
                                        Add a bot
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className='m-3 p-5'>
                            <p className='text-subtext0 text-4xl pl-10 font-bold'>Your bots</p>
                            <div>
                                {
                                    bots?.length && bots.map((data) => {
                                        return (
                                            <div className='flex justify-between m-10 p-3 bg-surface2/10 rounded-lg' key={data.username}>
                                                <div className='flex'>
                                                    <div className='pl-3 pr-10'>
                                                        <Image className='rounded-lg min-w-[75px]' src={data.avatar} alt={data.username} width={75} height={75} />
                                                    </div>
                                                    <div className='py-2'>
                                                        <p className='text-subtext0 text-xl font-bold'>{data.username}</p>
                                                        <p className='text-lavender/40 font-semibold pr-5'>{data.config.shortDescription}</p>
                                                    </div>
                                                </div>
                                                <div className='flex items-center'>
                                                    <button className='bg-red/10 rounded-lg text-left text-red/75 font-semibold px-4 py-2 mr-5 block hover:bg-red-Wenge/10' onClick={() => onDeleteBot(data.id)}>
                                                        Delete
                                                    </button>
                                                    <button className='bg-green/10 rounded-lg text-left text-subtext0/75 font-semibold px-4 py-2 mr-2 block hover:bg-green-CambridgeBlue/10'>
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