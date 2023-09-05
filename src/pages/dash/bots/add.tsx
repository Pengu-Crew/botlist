import { PENGUIN_EMOJI } from "@/lib/data/emojis"
import { useSession } from "next-auth/react"

const basicInputLabels: InputLabels[] = [
    {
        name: "ID",
        topic: "Type your bot id",
        type: "text",
        required: true,
        id: "id",
    }
]

const detailsInputLabels: InputLabels[] = [
    {
        name: "Short description",
        topic: "Write a brief description",
        type: "text",
        required: true,
        id: "short-description",
    }
]

function labels(input: InputLabels[]) {
    return input.map((label, index) => {
        return (
            <div className="p-5"  key={index}>
                <label htmlFor={label.id} className="text-CadetGray text-lg font-bold pl-5 pr-3">
                    {label.name} :
                </label>
                <input
                    type={label.type}
                    id={label.id}
                    name={label.id}
                    placeholder={label.topic}
                    className="bg-Charcoal/20 rounded-lg text-CadetGray border-Charcoal/30 leading-tight focus:outline-none focus:bg-Charcoal/30 placeholder:text-CadetGray/80 placeholder:pl-1 m-3 p-2"
                />
            </div>
        )
    })
}

export default function AddBot() {
    const { data: session } = useSession()
    return (
        <div className="flex justify-center">
            {
                session && (
                    <div className="w-11/12 p-5 m-5 rounded-lg">
                        <div className="bg-Charcoal/10 rounded-lg m-3 p-5 ">
                            <h1 className='text-LightGray/70 text-5xl font-extrabold p-5'>Add a new bot! {PENGUIN_EMOJI}</h1>
                            <div className="bg-Charcoal/5 rounded-lg m-3 mb-10 p-5">
                                <p className="text-CadetGray text-3xl font-bold pl-5">Basic data</p>
                                { labels(basicInputLabels) }
                                <p className="text-CadetGray text-3xl font-bold pl-5">Details</p>
                                { labels(detailsInputLabels) }
                            </div>
                            <div className='flex justify-end'>
                                <button className='bg-PaynesGray/20 rounded-lg text-left text-CadetGray font-semibold px-4 py-2 mr-2 block hover:bg-PaynesGray/10'>
                                    Search bot
                                </button>
                                <button className='bg-PaynesGray/20 rounded-lg text-left text-CadetGray font-semibold px-4 py-2 block hover:bg-PaynesGray/10'>
                                    Save
                                </button>
                            </div>
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
}