import Image from 'next/image';
import Link from 'next/link';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useSession } from 'next-auth/react';
import { PENGUIN_EMOJI } from '@/lib/data/emojis';
import { Bot } from '@/lib/types';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [bots, setBots] = useState<Bot[]>();
  const { data: session } = useSession();

  useEffect(() => {
    axios.get('/api/dash/db/bots').then(({ data }) => setBots(data.message));
  }, []);

  return (
    <div>
      <div className='pt-24 text-center'>
        <h1 className='p-5 text-5xl font-extrabold text-subtext0 lg:text-7xl'>
          Pengu BotList {PENGUIN_EMOJI}
        </h1>
        <p className='text-lg font-medium text-lavender/75 lg:text-xl'>
          It&apos;s an{' '}
          <a className='text-transparent bg-gradient-to-r from-peach to-teal bg-clip-text'>
            Pengudible
          </a>{' '}
          list of discord bots.
        </p>
        {session?.profile && (
          <p className='pb-5 pt-3 text-base font-medium text-subtext0/80 lg:pb-10 lg:pt-5'>
            Welcome {session.profile.global_name ?? session.profile.username}!
          </p>
        )}
        <div className={`flex justify-center px-5 ${!session && 'pt-10'}`}>
          <input
            className='block w-10/12 appearance-none rounded-lg border border-surface2/20 bg-surface2/10 px-6 py-3 leading-tight text-subtext0 placeholder:text-subtext0/80 focus:bg-surface2/30 focus:outline-none lg:w-3/4'
            type='text'
            placeholder={`Search among more than ${bots?.length} bots`}
          />
        </div>
      </div>

      <div className='flex justify-center px-5 py-10 lg:p-20'>
        <div className='rounded-lg bg-surface2/10 p-5 lg:w-2/3'>
          <h3 className='pl-2 text-2xl font-bold text-subtext0 lg:pl-10 lg:text-4xl'>
            Some of the best bots
          </h3>
          <div>
            {bots?.length &&
              bots
                .filter((d) => d.accepted)
                .sort((a, b) => b.votes?.length - a.votes?.length)
                .map((data) => {
                  return (
                    <Link href={`/bots/${data.id}`} key={data.id}>
                      <div
                        className='mt-5 flex justify-start rounded-lg bg-surface1/10 p-1 lg:m-10 lg:p-3'
                        key={data.username}
                      >
                        <div className='flex items-center px-3 lg:pr-10'>
                          <Image
                            className='min-w-[75px] rounded-lg'
                            src={data.avatar}
                            alt={data.username}
                            width={75}
                            height={75}
                          />
                        </div>
                        <div>
                          <div className='flex justify-between lg:py-2'>
                            <div className='flex items-center'>
                              <p className='text-base font-bold text-subtext0/75 lg:text-xl'>
                                {data.username}
                              </p>
                              <ArrowDropUpIcon
                                className='pl-2 text-PayneGray'
                                fontSize='large'
                              />
                              <div className='rounded-lg bg-green/10 px-1 lg:px-2'>
                                <p className='font-semibold text-green/75'>
                                  {data.votes.length}
                                </p>
                              </div>
                            </div>
                            {data.tags?.length && (
                              <div className='flex items-center'>
                                <p className='pr-3 text-xl text-subtext0'>#</p>
                                {data.tags.map((tag) => {
                                  return (
                                    <div
                                      className='mr-2 rounded-lg bg-surface2/10 px-2 py-1'
                                      key={tag}
                                    >
                                      <p className='font-semibold text-subtext0'>
                                        {tag}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          <p className='text-xs leading-3 text-lavender/40 lg:text-base/6 lg:font-semibold lg:leading-normal'>
                            {data.config.shortDescription}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}
