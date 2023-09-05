import Image from "next/image"
import { ChevronUpIcon } from '@sanity/icons'
import { useSession } from "next-auth/react"
import { BotData } from "@/lib/data/bots"
import { PENGUIN_EMOJI } from "@/lib/data/emojis"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div>
      <div className="text-center pt-24">

        <h1 className="text-LightGray text-7xl font-extrabold p-5">Pengu BotList {PENGUIN_EMOJI}</h1>
        <p className="text-CadetGray text-xl font-medium">It&apos;s an Pengudible list of discord bots.</p>
        { session?.profile && <p className="text-PaynesGray/90 text-base font-medium pt-5 pb-10">Welcome {session.profile.username}!</p> }
        <div className={`flex justify-center px-5 ${!session && 'pt-10'}`}>
          <input className="appearance-none block w-3/4 bg-Charcoal/20 border border-OuterSpace/30 rounded-lg py-3 px-6 leading-tight focus:outline-none focus:bg-Charcoal/30 text-CadetGray placeholder:text-CadetGray/80" type="text" placeholder="Search among more than 0 bots" />
        </div>
      </div>

      <div className="flex justify-center p-20">
        <div className="bg-Charcoal/10 w-2/3 p-5 rounded-lg">
          <h3 className="text-PaynesGray text-4xl pl-10 font-bold">Some of the best bots</h3>
          <div>
              {
                BotData.map((data) => {
                  return (
                    <div className="flex justify-start m-10 p-3 bg-OuterSpace/10 rounded-lg" key={data.name}>
                      <div className="pl-3 pr-10">
                        <Image className="rounded-lg min-w-[75px]" src={data.imageURL} alt={data.name} width={75} height={75} />
                      </div>
                      <div>
                        <div className="flex justify-between py-2">
                          <div className="flex">
                            <p className="text-CadetGray text-xl font-bold">{data.name}</p>

                            <ChevronUpIcon className="text-4xl text-PayneGray pl-2" />
                            <div className="bg-green-CambridgeBlue/10 px-2 py-1 rounded-lg">                     
                              <p className="text-green-CambridgeBlue font-semibold">{data.votes}</p>
                            </div>                     
                          </div>
                          {
                            data.tags?.length && (
                              <div className="flex items-center">
                                <p className="text-PayneGray text-xl pr-3">#</p>
                                {
                                  data.tags.map((tag) => {
                                    return (
                                      <div className="bg-CadetGray/10 mr-2 px-2 py-1 rounded-lg" key={tag}>
                                        <p className="text-CadetGray font-semibold">{tag}</p>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                            )
                          }
                        </div>                 
                        <p className="text-PaynesGray font-semibold ">{data.description}</p>
                      </div>

                    </div>
                  )
                })
              }
          </div>
        </div>
      </div>

    </div>
  )
}
