export function getAvatar({ id, discriminator, avatar }: GetAvatar) {
    if (avatar) return `https://cdn.discordapp.com/avatars/${id}/${avatar}.${avatar.startsWith('a_') ? 'gif' : 'png'}`
    else return `https://cdn.discordapp.com/embed/avatars/${parseInt(discriminator) % 5}.png`;
}

type GetAvatar = {
    avatar?: string,
    id: string,
    discriminator: string
}