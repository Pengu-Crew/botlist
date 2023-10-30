import { PENGUIN_EMOJI } from '@/lib/data/emojis';
import { BotAndOwner } from '@/lib/types';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Dialog, Transition } from '@headlessui/react';

export default function Bot() {
  const router = useRouter();
  const { data: session } = useSession();

  const [bot, setBot] = useState<BotAndOwner>();
  const [voteMessage, setVoteMessage] = useState<string | undefined>(undefined);
  const [isOpenVote, setIsOpenVote] = useState<boolean>(false);

  function links(icon: string, name: string, link?: string) {
    return (
      <div className='flex items-center pl-2 pt-3'>
        {linkButton(icon)}
        <p className='pl-2 pr-3 font-semibold text-subtext0/80'>{name}:</p>
        {link ? (
          <Link
            href={link}
            passHref={true}
            className='text-subtext0/75'
            rel='noopener noreferrer'
            target='_blank'
          >
            {link}
          </Link>
        ) : (
          <p>Unknow link</p>
        )}
      </div>
    );
  }

  function linkButton(iconName: string) {
    const iconStyle = 'text-subtext0 ml-2';

    switch (iconName) {
      case 'github':
        return <GitHubIcon className={iconStyle} sx={{ fontSize: '24px' }} />;
      case 'web':
        return <LanguageIcon className={iconStyle} sx={{ fontSize: '24px' }} />;
      case 'discord':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={`${iconStyle} h-6 w-6`}
            viewBox='0,0,256,256'
          >
            <g fill='#a5adcb' className='mix-blend-mode: normal'>
              <g transform='scale(5.33333,5.33333)'>
                <path d='M40,12c0,0 -4.585,-3.588 -10,-4l-0.488,0.976c4.896,1.198 7.142,2.915 9.488,5.024c-4.045,-2.065 -8.039,-4 -15,-4c-6.961,0 -10.955,1.935 -15,4c2.346,-2.109 5.018,-4.015 9.488,-5.024l-0.488,-0.976c-5.681,0.537 -10,4 -10,4c0,0 -5.121,7.425 -6,22c5.162,5.953 13,6 13,6l1.639,-2.185c-2.782,-0.967 -5.924,-2.694 -8.639,-5.815c3.238,2.45 8.125,5 16,5c7.875,0 12.762,-2.55 16,-5c-2.715,3.121 -5.857,4.848 -8.639,5.815l1.639,2.185c0,0 7.838,-0.047 13,-6c-0.879,-14.575 -6,-22 -6,-22zM17.5,30c-1.933,0 -3.5,-1.791 -3.5,-4c0,-2.209 1.567,-4 3.5,-4c1.933,0 3.5,1.791 3.5,4c0,2.209 -1.567,4 -3.5,4zM30.5,30c-1.933,0 -3.5,-1.791 -3.5,-4c0,-2.209 1.567,-4 3.5,-4c1.933,0 3.5,1.791 3.5,4c0,2.209 -1.567,4 -3.5,4z'></path>
              </g>
            </g>
          </svg>
        );
      default:
        return <div></div>;
    }
  }

  function onVote() {
    if (session?.profile)
      axios
        .get(`/api/dash/bots/vote?id=${bot?.id}&userID=${session?.profile.id}`)
        .then(({ data }) => {
          setVoteMessage(data.message);
          setTimeout(() => setIsOpenVote(true), 1000);
        });
    else {
      setVoteMessage('You must be logged in to vote for this bot.');
      setTimeout(() => setIsOpenVote(true), 1000);
    }
  }

  useEffect(() => {
    if (router.isReady) {
      const { query } = router;

      if (query)
        axios.get(`/api/dash/db/bot?id=${query.id}`).then(({ data }) => {
          if (data.message?.id) return setBot(data.message);
          else router.push('/');
        });
    }
  }, [router.query]);

  return (
    <div className='flex justify-center'>
      <Transition appear show={isOpenVote} as={Fragment}>
        <Dialog
          className='fixed inset-0 z-10 overflow-y-auto'
          onClose={() => setIsOpenVote(false)}
        >
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0' />
            </Transition.Child>
            <span
              className='inline-block h-screen align-middle'
              aria-hidden='true'
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div className='my-8 inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-mantle/95 p-6 align-middle transition-all'>
                <Dialog.Description className='text-left text-lg font-semibold text-subtext0/75'>
                  {voteMessage}
                </Dialog.Description>
                <button
                  className='mt-5 block rounded-lg bg-red/10 px-4 py-2 font-semibold text-red/75 hover:bg-red/20'
                  onClick={() => setIsOpenVote(false)}
                >
                  Close
                </button>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {bot && (
        <div className='m-5 w-11/12 rounded-lg bg-surface2/10 p-5'>
          <h1 className='p-5 text-5xl font-extrabold text-subtext0'>
            {bot.username} {PENGUIN_EMOJI}
          </h1>
          <div className='m-10 mt-3 flex justify-between rounded-lg bg-surface2/10 p-5'>
            <div className='flex items-center'>
              <Image
                className='ml-5 rounded-lg'
                src={bot.avatar}
                alt={bot.username}
                width={75}
                height={75}
              />
              <div className='py-5 pl-5 text-center'>
                <p className='text-3xl font-bold text-subtext0'>
                  {bot.username}
                </p>
                <p className='text-base font-semibold text-subtext0/75'>
                  ({bot.id})
                </p>
              </div>
              <div className='ml-5 rounded-lg bg-subtext0/10 p-2'>
                <p className='text-base font-semibold text-subtext0'>Bot</p>
              </div>
            </div>
            <div className='m-5 flex max-w-2xl items-center rounded-l bg-Charcoal/10 '>
              <p className='px-2 text-center font-semibold text-lavender/40'>
                {bot.config.shortDescription}
              </p>
            </div>
            <div className='flex items-center'>
              <button
                className='mr-3 block rounded-lg bg-green/10 px-4 py-2 font-semibold text-green/75 hover:bg-green/20'
                onClick={onVote}
              >
                Vote
              </button>
              <Link
                href={`https://discord.com/api/oauth2/authorize?client_id=${bot.id}&scope=bot+applications.commands`}
                rel='noopener noreferrer'
                target='_blank'
              >
                <button className='mr-5 block rounded-lg bg-surface2/10 px-4 py-2 font-semibold text-subtext0/75 hover:bg-subtext0/20'>
                  Invite
                </button>
              </Link>
            </div>
          </div>
          <div className='m-10 mt-3 rounded-lg bg-surface2/10 p-5'>
            <p className='px-2 font-semibold text-lavender/40'>
              {bot.config.longDescription}
            </p>
          </div>
          <p className='pl-10 text-3xl font-bold text-subtext0'>
            More Information {PENGUIN_EMOJI}
          </p>
          <div className='m-5 mt-3 flex justify-between rounded-lg bg-surface2/10 p-5'>
            <div>
              <div className='flex items-center py-3 pb-6'>
                <p className='pl-5 pr-2 text-lg font-semibold text-subtext0'>
                  Prefix:
                </p>
                <div className='rounded-lg bg-surface2/10 px-2 py-1'>
                  <p className='text-base text-subtext0/80'>
                    {bot.config.prefix}
                  </p>
                </div>
              </div>
              <div>
                <p className='pb-3 pl-5 text-xl font-bold text-subtext0'>
                  Owner
                </p>
                <div className='ml-10 flex items-center rounded-lg bg-surface2/10 p-3'>
                  <Image
                    className='rounded-lg'
                    src={bot.owner.avatar}
                    alt={bot.owner.username}
                    height={60}
                    width={60}
                  />
                  <div className='px-5 text-center'>
                    <p className='font-semibold text-subtext0'>
                      {bot.owner.global_name ?? bot.owner.username}
                    </p>
                    <p className='text-sm text-subtext0/80'>({bot.ownerID})</p>
                  </div>
                </div>
              </div>
            </div>
            {(bot.config.links.linkDiscordServer ||
              bot.config.links.linkGithub ||
              bot.config.links.linkWebSite) && (
              <div className='m-5'>
                <p className='pb-2 text-3xl font-bold text-subtext0'>Links</p>
                {bot.config.links.linkDiscordServer &&
                  links(
                    'discord',
                    'Discord Server',
                    bot.config.links.linkDiscordServer
                  )}
                {bot.config.links.linkGithub &&
                  links('github', 'Github', bot.config.links.linkGithub)}
                {bot.config.links.linkWebSite &&
                  links('web', 'Website', bot.config.links.linkWebSite)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
