import Image from 'next/image';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className='m-5 flex items-center justify-between rounded-lg bg-surface2/10 p-5 pt-7'>
      <Link href='/'>
        <p className='text-center text-xl font-extrabold text-subtext0'>
          Pengu BotList
        </p>
      </Link>

      <Menu as='div' className='relative inline-block'>
        <Menu.Button className='inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-surface2/10 p-3 shadow-sm hover:bg-surface2/20'>
          {session?.profile?.avatar ? (
            <Image
              className='rounded-lg'
              src={session.profile.avatar}
              alt={session.profile.username}
              width={40}
              height={40}
            />
          ) : (
            <p className='text-3xl'>&#128039;</p>
          )}
        </Menu.Button>

        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right rounded-sm bg-mantle/95 text-left text-sm font-semibold ring-1 ring-surface2/20 focus:outline-none'>
            {session && (
              <Menu.Item>
                <Link href='/dash/profile'>
                  <button
                    className={`block w-full px-4 py-2 text-left text-subtext0/75 hover:rounded-sm hover:bg-surface2/10`}
                  >
                    Profile
                  </button>
                </Link>
              </Menu.Item>
            )}
            <Menu.Item>
              <button
                className={`block w-full px-4 py-2 text-left hover:rounded-sm hover:bg-surface2/10 ${
                  session ? 'text-red/75' : 'text-green/75'
                }`}
                onClick={() => (session ? signOut() : signIn('discord'))}
              >
                {session ? 'LogOut' : 'Login'}
              </button>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
