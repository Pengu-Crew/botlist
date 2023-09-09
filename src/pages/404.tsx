import Link from 'next/link';
import { PENGUIN_EMOJI } from '@/lib/data/emojis'

export default function PageNotFound() {
    return (
        <div>
            <div className='text-center pt-44'>
                <h1 className='text-LightGray text-5xl font-extrabold p-5'>You seem to be lost in the great world of penguins</h1>
                <p className='text-CadetGray text-3xl font-medium'>Let our friend pengu take you to the home page.</p>
                <p className='text-7xl pt-12 pb-5'>{PENGUIN_EMOJI}</p>
            </div>
            <div className='flex justify-center'>
                <Link href='/'>
                    <button className='bg-PaynesGray/20 rounded-lg text-left text-CadetGray font-semibold px-4 py-2 block hover:bg-PaynesGray/10'>
                        Home
                    </button>
                </Link>
            </div>
        </div>
    )
}