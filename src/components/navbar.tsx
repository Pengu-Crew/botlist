import Image from 'next/image'
import { Fragment } from 'react'
import { Menu, Transition } from "@headlessui/react"
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Navbar() {
    const { data: session } = useSession()

    return (
        <div className="bg-Charcoal/10 rounded-lg flex justify-between items-center p-5 pt-7 m-5">
            <p className="text-xl text-CadetsGray/75 font-extrabold text-center">Pengu BotList</p>

            <Menu as="div" className="relative inline-block">
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-PayneGray/10 shadow-sm p-3 hover:bg-PayneGray/20">
                    {
                        session?.profile?.avatar ? <Image className="rounded-lg" src={session.profile.avatar} alt={session.profile.username} width={40} height={40} /> : <p className="text-3xl">&#128039;</p>
                    }
                </Menu.Button>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-sm bg-PayneGray/10 ring-1 ring-PaynesGray/20 text-left text-sm font-semibold focus:outline-none">
                        <Menu.Item>
                            <button className={`text-left px-4 py-2 block w-full hover:bg-PaynesGray/20 hover:rounded-sm ${session ? 'text-red-Wenge' : 'text-green-CambridgeBlue'}` }
                                    onClick={ () => session ? signOut() : signIn('discord') }>
                                {
                                    session ? 'LogOut' : 'Login'
                                }
                            </button>
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}