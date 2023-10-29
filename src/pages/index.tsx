import Image from 'next/image'
import Link from 'next/link'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useSession } from 'next-auth/react'
import { PENGUIN_EMOJI } from '@/lib/data/emojis'
import { Bot } from '@/lib/types'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [bots, setBots] = useState<Bot[]>()
  const { data: session } = useSession()
  
  useEffect(() => {
    axios.get('/api/dash/db/bots').then(({ data }) => setBots(data.message))
  }, [])

  return (
    <div>
      <div className='text-center pt-24'>
        <h1 className='text-subtext0 text-7xl font-extrabold p-5'>Pengu BotList {PENGUIN_EMOJI}</h1>
        <p className='text-lavender/75 text-xl font-medium'>It&apos;s an Pengudible list of discord bots.</p>
        { session?.profile && <p className='text-subtext0/90 text-base font-medium pt-5 pb-10'>Welcome {session.profile.global_name ?? session.profile.username}!</p> }
        <div className={`flex justify-center px-5 ${!session && 'pt-10'}`}>
          <input className='appearance-none block w-3/4 bg-surface2/10 border border-surface2/20 rounded-lg py-3 px-6 leading-tight focus:outline-none focus:bg-surface2/30 text-subtext0 placeholder:text-subtext0/80' type='text' placeholder='Search among more than 0 bots' />
        </div>
      </div>

      <div className='flex justify-center p-20'>
        <div className='bg-surface2/10 w-2/3 p-5 rounded-lg'>
          <h3 className='text-subtext0 text-4xl pl-10 font-bold'>Some of the best bots</h3>
          <div>
              {
                bots?.length && bots.map((data) => {
                  return (
                    <Link href={`/bots/${data.id}`} key={data.id} >
                      <div className='flex justify-start m-10 p-3 bg-surface1/10 rounded-lg' key={data.username}>
                        <div className='pl-3 pr-10'>
                          <Image className='rounded-lg min-w-[75px]' src={data.avatar} alt={data.username} width={75} height={75} />
                        </div>
                        <div>
                          <div className='flex justify-between py-2'>
                            <div className='flex'>
                              <p className='text-subtext0/75 text-xl font-bold'>{data.username}</p>
                              <ArrowDropUpIcon className=' text-PayneGray pl-2' fontSize='large' />
                              <div className='bg-green/10 px-2 py-1 rounded-lg'>                     
                                <p className='text-green/75 font-semibold'>0</p>
                              </div>                     
                            </div>
                            {
                              data.tags?.length && (
                                <div className='flex items-center'>
                                  <p className='text-subtext0 text-xl pr-3'>#</p>
                                  {
                                    data.tags.map((tag) => {
                                      return (
                                        <div className='bg-surface2/10 mr-2 px-2 py-1 rounded-lg' key={tag}>
                                          <p className='text-subtext0 font-semibold'>{tag}</p>
                                        </div>
                                      )
                                    })
                                  }
                                </div>
                              )
                            }
                          </div>                 
                          <p className='text-lavender/40 font-semibold'>{data.config.shortDescription}</p>
                        </div>
                      </div>
                    </Link>

                  )
                })
              }
          </div>
        </div>
      </div>

    </div>
  )
}
