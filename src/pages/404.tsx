import Link from 'next/link';
import { PENGUIN_EMOJI } from '@/lib/data/emojis';

export default function PageNotFound() {
  return (
    <div>
      <div className='pt-44 text-center'>
        <h1 className='p-5 text-5xl font-extrabold text-subtext0'>
          You seem to be lost in the great world of penguins
        </h1>
        <p className='text-3xl font-medium text-subtext0/75'>
          Let our friend pengu take you to the home page.
        </p>
        <p className='pb-5 pt-12 text-7xl'>{PENGUIN_EMOJI}</p>
      </div>
      <div className='flex justify-center'>
        <Link href='/'>
          <button className='block rounded-lg bg-surface2/20 px-4 py-2 text-left font-semibold text-subtext0 hover:bg-surface2/10'>
            Home
          </button>
        </Link>
      </div>
    </div>
  );
}
