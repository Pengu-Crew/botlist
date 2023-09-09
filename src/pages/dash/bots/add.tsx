import { PENGUIN_EMOJI } from '@/lib/data/emojis'
import { DiscordUser } from '@/lib/types'
import { DISCORD_ID_REGEX } from '@/lib/utils/constants'
import axios from 'axios'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { ChangeEvent, useState } from 'react'

const basicInputLabels: InputLabels[] = [
    {
        name: 'ID',
        topic: 'Type your bot id',
        type: 'text',
        required: true,
        id: 'id',
        maxLength: 19,
        minLength: 17
    }
]

const detailsInputLabels: InputLabels[] = [
    {
        name: 'Short description',
        topic: 'Write a brief description (maximum 124 characters)',
        type: 'textarea',
        required: true,
        id: 'short-description',
        maxLength: 128,
        minLength: 20,
        style: 'min-w-[70%] h-24'
    },
    {
        name: 'Long description',
        topic: 'Write a more detailed description of your bot (maximum 512 characters)',
        type: 'textarea',
        required: true,
        id: 'long-description',
        maxLength: 512,
        minLength: 264,
        style: 'min-w-[75%] h-64'
    }
]

export default function AddBot() {
    const [searchButton, setSearchButton] = useState<{ clicked?: boolean, error?: string }>()
    const [id, setId] = useState<string>()
    const [bot, setBot] = useState<DiscordUser>()
    const { data: session } = useSession()

    function handle(data: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (data.target.id === 'id') {
            if (DISCORD_ID_REGEX.test(data.target.value)) return setId(data.target.value)
            else if (id) return setId(undefined)
        }
    }

    function fetchBot() {
        if (!id) return

        setSearchButton({ clicked: true })

        axios.get(`/api/dash/bots/getInfo?id=${id}`).then(({ data }) => {
            setSearchButton({ clicked: false })
            if (data.message.id) {
                setId(undefined)
                return setBot(data.message)
            }
            return 
        }).catch(() => {
            setSearchButton({ clicked: false, error: 'The bot was not found, verify that the id is correct.' })

            setTimeout(() => {
                setSearchButton({ error: undefined })
            }, 7000)

            setId(undefined)
        })
    }
    
    function labels(input: InputLabels[]) {
        return input.map((label, index) => {
            const style = `${label.style} bg-Charcoal/10 rounded-lg text-CadetGray border-Charcoal/30 leading-tight focus:outline-none focus:bg-Charcoal/30 placeholder:text-CadetGray/80 placeholder:pl-1 mx-3 p-2`

            return (
                <div className='flex items-center p-5' key={index}>
                    <label htmlFor={label.id} className='text-CadetGray text-lg font-bold pl-5 pr-3'>
                        {label.name}:
                    </label>
                    {
                        label.type === 'textarea' ?
                            <textarea
                                id={label.id}
                                name={label.id}
                                placeholder={label.topic}
                                minLength={label.minLength}
                                maxLength={label.maxLength}
                                onChange={handle}
                                className={`${style} resize-none`}
                            />
                        : 
                            <input
                                type={label.type}
                                id={label.id}
                                name={label.id}
                                placeholder={label.topic}
                                minLength={label.minLength}
                                maxLength={label.maxLength}
                                onChange={handle}
                                className={style}
                            />
                    }
    
                </div>
            )
        })
    }
    return (
        <div className='flex justify-center'>
            {
                session && (
                    <div className='w-11/12 p-5 m-5 rounded-lg'>
                        <div className='bg-Charcoal/10 rounded-lg m-3 p-5 '>
                            <h1 className='text-LightGray/70 text-5xl font-extrabold p-5'>Add a new bot! {PENGUIN_EMOJI}</h1>
                            <div className='bg-Charcoal/10 rounded-lg m-3 mb-10 p-5'>
                                {
                                    bot && 
                                    <div className='bg-Charcoal/10 rounded-lg flex items-center p-5 m-10 mt-3'>
                                        <Image className='rounded-lg ml-5' src={bot.avatar} alt={bot.username} width={75} height={75} />
                                        <div className='text-center p-5'>
                                            <p className='text-CadetGray text-3xl font-bold'>{bot.username}#{bot.discriminator}</p>
                                            <p className='text-CadetGray/75 text-base font-semibold'>({bot.id})</p>
                                        </div>                               
                                        <div className='bg-LightCyan/10 rounded-lg p-2 ml-2'>
                                            <p className='text-CadetsGray text-lg font-semibold'>Bot</p>
                                        </div>                                     
                                    </div>
                                }
                                <p className='text-CadetGray text-3xl font-bold pl-5'>Basic data</p>
                                { labels(basicInputLabels) }
                                {
                                    bot && 
                                    <div>
                                        <p className='text-CadetGray text-3xl font-bold pl-5'>Details</p>
                                        <div className='grid grid-cols-2'>
                                            { labels(detailsInputLabels) }
                                        </div>
                                    </div>
                                }                 
                            </div>
                            <div className='flex justify-end'>
                                <button className={`bg-PaynesGray/20 rounded-lg text-left text-CadetGray font-semibold px-4 py-2 mr-2 block hover:bg-PaynesGray/10 ${!id && 'cursor-not-allowed'}`} onClick={fetchBot}>
                                    {
                                        searchButton?.clicked && 
                                        <svg aria-hidden='true' role='status' className='inline w-4 h-4 mr-3 text-PayneGray animate-spin' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                            <path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='#E5E7EB'/>
                                            <path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentColor'/>
                                        </svg>
                                    }
                                    Search bot
                                </button>
                                <button className='bg-PaynesGray/20 rounded-lg text-left text-CadetGray font-semibold px-4 py-2 block hover:bg-PaynesGray/10 cursor-not-allowed'>
                                    Save
                                </button>
                            </div>
                            {
                                searchButton?.error &&
                                <div className='flex justify-end pt-1'>
                                    <p className='text-red-Wenge text-sm'>{searchButton.error}</p>
                                </div>
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}

type InputLabels = {
    name: string;
    topic: string;
    type: string;
    required: boolean;
    id: string;
    minLength?: number
    maxLength?: number
    style?: string
}

type ErrorLabels = {
    id: string
    errors: ExtendErrors[]
}

type ExtendErrors = {
    text: string,
    id: number
}