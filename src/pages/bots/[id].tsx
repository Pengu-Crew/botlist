import { PENGUIN_EMOJI } from "@/lib/data/emojis"
import { BotAndOwner } from "@/lib/types"
import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Image from 'next/image'
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import Link from "next/link"

export default function Bot() {
    const router = useRouter()
    const [bot, setBot] = useState<BotAndOwner>()

    function links(icon: string, name: string, link?: string) {
        return (
            <div className="flex items-center pl-2 pt-3">
                { linkButton(icon) }
                <p className="text-CadetGray pr-3 pl-2">{name}:</p>
                {
                     link ? <Link href={link} className="text-CadetsGray ">{link}</Link> : <p>Unknow link</p>
                }
            </div>
        )
    }

    function linkButton(iconName: string) {
        const iconStyle = 'text-CadetGray ml-2'

        switch(iconName) {
            case 'github': return <GitHubIcon className={iconStyle} sx={{ fontSize: '24px' }} />
            case 'web': return <LanguageIcon className={iconStyle} sx={{ fontSize: '24px' }} />
            case 'discord': return (
                <svg xmlns="http://www.w3.org/2000/svg" className={`${iconStyle} w-6 h-6`} viewBox="0,0,256,256">
                    <g fill="#7d909a" className="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path d="M40,12c0,0 -4.585,-3.588 -10,-4l-0.488,0.976c4.896,1.198 7.142,2.915 9.488,5.024c-4.045,-2.065 -8.039,-4 -15,-4c-6.961,0 -10.955,1.935 -15,4c2.346,-2.109 5.018,-4.015 9.488,-5.024l-0.488,-0.976c-5.681,0.537 -10,4 -10,4c0,0 -5.121,7.425 -6,22c5.162,5.953 13,6 13,6l1.639,-2.185c-2.782,-0.967 -5.924,-2.694 -8.639,-5.815c3.238,2.45 8.125,5 16,5c7.875,0 12.762,-2.55 16,-5c-2.715,3.121 -5.857,4.848 -8.639,5.815l1.639,2.185c0,0 7.838,-0.047 13,-6c-0.879,-14.575 -6,-22 -6,-22zM17.5,30c-1.933,0 -3.5,-1.791 -3.5,-4c0,-2.209 1.567,-4 3.5,-4c1.933,0 3.5,1.791 3.5,4c0,2.209 -1.567,4 -3.5,4zM30.5,30c-1.933,0 -3.5,-1.791 -3.5,-4c0,-2.209 1.567,-4 3.5,-4c1.933,0 3.5,1.791 3.5,4c0,2.209 -1.567,4 -3.5,4z"></path></g></g>
                </svg>
            ) 
            default: return <div></div>
        }
    }

    useEffect(() => {
        if (router.isReady) {
            const { query } = router

            if (query) axios.get(`/api/dash/db/bot?id=${query.id}`).then(({ data }) => {
                if (data.message?.id) return setBot(data.message)
                else router.push('/')
            })

        }
    }, [router.query])
    
    return (
        <div className='flex justify-center'>
            {
                bot &&
                <div className='bg-Charcoal/10 w-11/12 p-5 m-5 rounded-l'>
                    <h1 className='text-LightGray/70 text-5xl font-extrabold p-5'>{bot.username} {PENGUIN_EMOJI}</h1>
                    <div className='bg-Charcoal/10 rounded-lg flex justify-between p-5 m-10 mt-3'>
                        <div className="flex items-center">
                            <Image className='rounded-lg ml-5' src={bot.avatar} alt={bot.username} width={75} height={75} />
                            <div className='text-center py-5 pl-5'>
                                <p className='text-CadetGray text-3xl font-bold'>{bot.username}</p>
                                <p className='text-CadetGray/75 text-base font-semibold'>({bot.id})</p>
                            </div>
                            <div className='bg-LightCyan/10 rounded-lg p-2 ml-5'>
                                <p className='text-CadetsGray text-base font-semibold'>Bot</p>
                            </div>   
                        </div>
                        <div className='flex items-center max-w-2xl bg-Charcoal/10 rounded-l m-5 '>
                            <p className="text-center text-PaynesGray/80 font-semibold px-2">{bot.config.shortDescription}</p>
                        </div>
                        <div className="flex items-center">
                            <button className="bg-green-CambridgeBlue/30 rounded-lg text-green-CambridgeBlue/80 font-semibold px-4 py-2 mr-3 block hover:bg-green-CambridgeBlue/20">Vote</button>
                            <button className="bg-LightGray/30 rounded-lg text-LightGray/80 font-semibold px-4 py-2 mr-5 block hover:bg-LightGray/20">Invite</button>
                        </div>                                
                    </div>
                    <div className="bg-Charcoal/10 rounded-lg p-5 m-10 mt-3">
                        <p className="text-PaynesGray/90 font-semibold px-2">{bot.config.longDescription}</p>
                    </div>
                    <p className="text-CadetGray  text-3xl font-bold pl-10">More Information {PENGUIN_EMOJI}</p>
                    <div className="bg-Charcoal/10 flex justify-between rounded-lg p-5 m-5 mt-3">
                        <div>
                            <div className="flex items-center py-3 pb-6">
                                <p className="text-CadetGray font-semibold text-lg pl-5 pr-2">Prefix:</p>
                                <div className="bg-CadetGray/10 px-2 py-1 rounded-lg">
                                    <p className="text-CadetsGray/80 text-base">{bot.config.prefix}</p>     
                                </div>
                            </div>
                            <div>
                                <p className="text-CadetGray text-xl font-bold pl-5 pb-3">Owner</p>
                                <div className="bg-Charcoal/10 rounded-lg flex items-center ml-10 p-3">
                                    <Image className="rounded-lg" src={bot.owner.avatar} alt={bot.owner.username} height={60} width={60} />
                                    <div className="text-center px-5">
                                        <p className="text-CadetGray font-semibold">{bot.owner.global_name ?? bot.owner.username}</p>
                                        <p className="text-CadetGray/80 text-sm">({bot.ownerID})</p>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        {
                            (bot.config.links.linkDiscordServer || bot.config.links.linkGithub || bot.config.links.linkWebSite) &&
                            <div className="m-5">
                                <p className="text-CadetGray text-3xl font-bold pb-2">Links</p>
                                { bot.config.links.linkDiscordServer && links('discord', 'Discord Server', bot.config.links.linkDiscordServer) }
                                { bot.config.links.linkGithub && links('github', 'Github', bot.config.links.linkGithub) }
                                { bot.config.links.linkWebSite && links('web', 'Website', bot.config.links.linkWebSite) }
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}