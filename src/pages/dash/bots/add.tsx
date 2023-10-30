import { PENGUIN_EMOJI } from '@/lib/data/emojis';
import { Bot, DiscordUser } from '@/lib/types';
import { DISCORD_ID_REGEX } from '@/lib/utils/constants';
import axios from 'axios';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';

const detailsInputLabels: InputLabels[] = [
  {
    name: 'Short description',
    topic: 'Write a brief description (maximum 124 characters)',
    type: 'textarea',
    required: true,
    id: 'shortDescription',
    maxLength: 128,
    minLength: 20,
    style: 'min-w-full h-24',
  },
  {
    name: 'Long description',
    topic:
      'Write a more detailed description of your bot (maximum 512 characters)',
    type: 'textarea',
    required: true,
    id: 'longDescription',
    maxLength: 512,
    minLength: 264,
    style: 'min-w-full h-64',
  },
  {
    name: 'prefix',
    topic: 'The prefix of your bot',
    type: 'text',
    required: true,
    id: 'prefix',
    maxLength: 7,
    minLength: 1,
  },
];

const linksInputLabels: InputLabels[] = [
  {
    name: 'Discord server',
    topic: 'Link to support server',
    id: 'linkDiscordServer',
    type: 'text',
    pattern: {
      regexp:
        /(?:https?:\/\/)?discord(?:(?:app)?\.com\/invite|\.gg)\/?[a-zA-Z0-9]+\/?/,
      message: 'It seems that it is not a discord invitation',
    },
    required: false,
  },
  {
    name: 'Bot website',
    topic: "Link to the bot's website",
    id: 'linkWebSite',
    type: 'text',
    pattern: {
      regexp:
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
      message: 'It seems that the link is invalid',
    },
    required: false,
  },
  {
    name: 'Github',
    topic: 'Link to the bot github repository',
    id: 'linkGithub',
    type: 'text',
    pattern: {
      regexp: /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9-]+/,
      message: "It looks like it's not a link to github",
    },
    required: false,
  },
  {
    name: 'Custom invite',
    topic: 'Bot invitation link',
    id: 'customInvite',
    type: 'text',
    pattern: {
      regexp:
        /^https:\/\/discord\.com\/api\/oauth2\/authorize\?client_id=\d+&scope=(bot\+applications\.commands|applications\.commands\+bot|bot)?(&permissions=\d+)?$/, //+applications.commands
      message: 'The link must be a discord invitation.',
    },
    required: false,
  },
];

export default function AddBot() {
  const [searchButton, setSearchButton] = useState<{
    clicked?: boolean;
    error?: string;
  }>();
  const [saveButton, setSaveButton] = useState<string>();
  const [id, setId] = useState<string>();
  const [bot, setBot] = useState<DiscordUser>();
  const { data: session } = useSession();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  function handle(data: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (data.target.id === 'id') {
      if (DISCORD_ID_REGEX.test(data.target.value))
        return setId(data.target.value);
      else if (id) return setId(undefined);
    }
  }

  function fetchBot() {
    if (!id) return;

    setSearchButton({ clicked: true });

    axios
      .get(`/api/dash/bot?id=${id}`)
      .then(({ data }) => {
        setSearchButton({ clicked: false });
        if (data.message.id) {
          setId(undefined);
          return setBot(data.message);
        }
        return;
      })
      .catch(({ response }) => {
        setSearchButton({
          clicked: false,
          error:
            response.data.message ??
            'The bot was not found, verify that the id is correct.',
        });

        setTimeout(() => {
          setSearchButton({ error: undefined });
        }, 7000);

        setId(undefined);
      });
  }
  const onSubmit = handleSubmit((formData) => {
    setSaveButton('The information is being saved...');

    let invite: string = `https://discord.com/api/oauth2/authorize?client_id=${bot?.id}&scope=bot`;
    if (formData.customInvite) {
      const match = formData.customInvite.match(/client_id=(\d+)/);
      if (match && match[1]) {
        if (match[1] === bot?.id) invite = formData.customInvite;
      }
    }

    let discordServer: string | undefined = undefined;
    if (formData.linkDiscordServer) {
      if (!/^https:\/\//.test(formData.linkDiscordServer))
        discordServer = 'https://' + formData.linkDiscordServer;
    }

    const data: Bot = {
      id: bot?.id as string,
      username: bot?.username as string,
      avatar: bot?.avatar as string,
      ownerID: session?.profile.id as string,
      discriminator: bot?.discriminator ?? '0000',
      config: {
        longDescription: formData.longDescription as string,
        shortDescription: formData.shortDescription as string,
        prefix: formData.prefix as string,
        links: {
          linkDiscordServer: discordServer,
          linkWebSite: formData.linkWebSite,
          linkGithub: formData.linkGithub,
          invite,
        },
      },
      votes: [],
    };

    axios
      .post('/api/dash/bot', { data })
      .then(({ data }) =>
        setSaveButton(data.message ?? 'The information was saved correctly!')
      );
  });

  function labels(input: InputLabels[]) {
    return input.map((label) => {
      const style = `${label.style} bg-surface2/10 rounded-lg text-subtext0 border-surface2/30 leading-tight focus:outline-none focus:bg-Charcoal/30 placeholder:text-CadetGray/80 placeholder:pl-1 mx-3 p-2`;
      const registers = {
        ...register(label.id, {
          pattern: label.pattern
            ? { value: label.pattern.regexp, message: label.pattern.message }
            : undefined,
          required: {
            value: label.required,
            message: 'This field is required',
          },
          maxLength: {
            value: label.maxLength ?? 999,
            message: `The text must have a maximum of ${label.maxLength} characters`,
          },
          minLength: {
            value: label.minLength ?? 0,
            message: `The text must be at least ${label.minLength} characters long`,
          },
        }),
      };

      return (
        <div
          className='flex items-center justify-between px-5 py-3'
          key={label.id}
        >
          <label
            htmlFor={label.id}
            className='pl-5 pr-3 text-lg font-bold text-subtext0'
          >
            {label.name}:
          </label>
          <div className='min-w-[70%]'>
            {label.type === 'textarea' ? (
              <textarea
                id={label.id}
                placeholder={label.topic}
                minLength={label.minLength}
                maxLength={label.maxLength}
                className={`${style} resize-none`}
                {...registers}
              />
            ) : (
              <input
                type={label.type}
                id={label.id}
                placeholder={label.topic}
                minLength={label.minLength}
                maxLength={label.maxLength}
                className={style}
                {...registers}
              />
            )}
            {errors[label.id] && (
              <p className='px-3 pt-1 text-sm text-red/75'>
                {errors[label.id]?.message as string}
              </p>
            )}
          </div>
        </div>
      );
    });
  }
  return (
    <div className='flex justify-center'>
      {session && (
        <div className='m-5 w-11/12 rounded-lg p-5'>
          <div className='m-3 rounded-lg bg-surface2/10 p-5'>
            <h1 className='p-5 text-5xl font-extrabold text-subtext0/95'>
              Add a new bot! {PENGUIN_EMOJI}
            </h1>
            <div className='m-3 mb-10 rounded-lg bg-surface1/10 p-5'>
              {bot && (
                <div className='m-10 mt-3 flex items-center rounded-lg bg-surface2/5 p-5'>
                  <Image
                    className='ml-5 rounded-lg'
                    src={bot.avatar}
                    alt={bot.username}
                    width={75}
                    height={75}
                  />
                  <div className='p-5 text-center'>
                    <p className='text-3xl font-bold text-subtext0'>
                      {bot.username}
                    </p>
                    <p className='text-base font-semibold text-subtext0/75'>
                      ({bot.id})
                    </p>
                  </div>
                  <div className='rounded-lg bg-surface2/10 p-2'>
                    <p className='text-base font-semibold text-subtext0'>Bot</p>
                  </div>
                </div>
              )}
              <p className='pl-5 text-3xl font-bold text-subtext0'>
                Basic data
              </p>
              <div className='flex items-center p-5' key='id'>
                <label
                  htmlFor='id'
                  className='pl-5 pr-3 text-lg font-bold text-subtext0/75'
                >
                  ID:
                </label>
                <input
                  type='text'
                  id='id'
                  name='id'
                  placeholder='Type your bot id'
                  minLength={17}
                  maxLength={19}
                  onChange={handle}
                  className='mx-3 rounded-lg border-surface2/30 bg-surface2/10 p-2 leading-tight text-subtext0 placeholder:pl-1 placeholder:text-subtext0/80 focus:bg-surface2/30 focus:outline-none'
                />
              </div>
              {bot && (
                <div>
                  <p className='pl-5 text-3xl font-bold text-subtext0'>
                    Details
                  </p>
                  <div className='grid grid-cols-2'>
                    {labels(detailsInputLabels)}
                  </div>
                  <div className='max-w-[50%] p-5'>
                    <p className='text-2xl font-bold text-subtext0'>Links</p>
                    {labels(linksInputLabels)}
                  </div>
                </div>
              )}
            </div>
            <div className='flex justify-end'>
              <button
                className={`mr-2 block rounded-lg bg-surface2/20 px-4 py-2 text-left font-semibold text-subtext0 hover:bg-surface2/10 ${
                  !id && 'cursor-not-allowed'
                }`}
                onClick={fetchBot}
              >
                {searchButton?.clicked && (
                  <svg
                    aria-hidden='true'
                    role='status'
                    className='mr-3 inline h-4 w-4 animate-spin text-PayneGray'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='#E5E7EB'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentColor'
                    />
                  </svg>
                )}
                Search bot
              </button>
              <button
                className={`block rounded-lg bg-surface2/20 px-4 py-2 text-left font-semibold text-subtext0 hover:bg-surface2/10 ${
                  !bot && 'cursor-not-allowed'
                }`}
                onClick={onSubmit}
              >
                Save
              </button>
            </div>
            {searchButton?.error && (
              <div className='flex justify-end pt-1'>
                <p className='text-sm text-red/75'>{searchButton.error}</p>
              </div>
            )}
            {saveButton && (
              <div className='flex justify-end pt-1'>
                <p className='text-sm text-green/75'>{saveButton}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type InputLabels = {
  name: string;
  topic: string;
  type: string;
  required: boolean;
  id: string;
  pattern?: {
    regexp: RegExp;
    message: string;
  };
  minLength?: number;
  maxLength?: number;
  style?: string;
};
