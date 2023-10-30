import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Bot } from '@/lib/types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { hexToRgba } from '@/lib/utils/utils';

export default function Profile() {
  const [bots, setBots] = useState<Bot[]>();
  const { data: session } = useSession();

  function onDeleteBot(id: string) {
    axios.delete(`/api/dash/bot?id=${id}`).then((data) => {
      if (data.status === 200) setTimeout(() => window.location.reload(), 1500);
    });
  }

  useEffect(() => {
    axios
      .get('/api/dash/db/user/bots')
      .then(({ data }) => setBots(data.message))
      .catch(() => setBots(undefined));
  }, []);

  return (
    <div className='flex justify-center'>
      {session && (
        <div className='m-5 w-11/12 rounded-lg bg-surface2/10 p-5'>
          <div
            style={{
              backgroundColor: hexToRgba(session.profile.hexAccentColor, 0.1),
            }}
            className={`m-3 mb-8 flex justify-between rounded-lg`}
          >
            <div className='flex p-5'>
              <Image
                className='rounded-lg'
                src={session.profile.avatar}
                width={100}
                height={100}
                alt={session.profile.username}
              />
              <h1 className='p-5 text-5xl font-extrabold text-subtext0'>
                {session.profile.global_name ?? session.profile.username}
              </h1>
            </div>
            <div className='flex items-center'>
              <Link href='/dash/bots/add'>
                <button className='mr-5 block rounded-lg bg-surface2/20 px-4 py-2 text-left font-semibold text-subtext0/75 hover:bg-PaynesGray/10'>
                  Add a bot
                </button>
              </Link>
            </div>
          </div>
          <div className='m-3 p-5'>
            <p className='pl-10 text-4xl font-bold text-subtext0'>Your bots</p>
            <div>
              {bots?.length &&
                bots.map((data) => {
                  return (
                    <div
                      className='m-10 flex justify-between rounded-lg bg-surface2/10 p-3'
                      key={data.username}
                    >
                      <div className='flex'>
                        <div className='pl-3 pr-10'>
                          <Image
                            className='min-w-[75px] rounded-lg'
                            src={data.avatar}
                            alt={data.username}
                            width={75}
                            height={75}
                          />
                        </div>
                        <div className='py-2'>
                          <p className='text-xl font-bold text-subtext0'>
                            {data.username}
                          </p>
                          <p className='pr-5 font-semibold text-lavender/40'>
                            {data.config.shortDescription}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center'>
                        <button
                          className='mr-5 block rounded-lg bg-red/10 px-4 py-2 text-left font-semibold text-red/75 hover:bg-red-Wenge/10'
                          onClick={() => onDeleteBot(data.id)}
                        >
                          Delete
                        </button>
                        <button className='mr-2 block rounded-lg bg-green/10 px-4 py-2 text-left font-semibold text-subtext0/75 hover:bg-green-CambridgeBlue/10'>
                          Edit
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
