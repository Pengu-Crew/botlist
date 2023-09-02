import Image from "next/image"

const data = [
  {
    name: 'Cuchus',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit, parturient dis venenatis semper condimentum augue, velit mattis senectus nam per ridiculus.',
    imageURL: 'https://cdn.discordapp.com/avatars/892993411169267722/6761200c74904f94f97305dbd1e437e4.png'
  },
  {
    name: 'BotListBot',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit, parturient dis venenatis semper condimentum augue, velit mattis senectus nam per ridiculus.',
    imageURL: 'https://cdn.discordapp.com/avatars/959109912913387583/0c85634de322060f82d2eb20888ecbf6.png'
  }
]

export default function Home() {
  return (
    <div>
      <div className="text-center pt-52">
        <h1 className="text-LightGray text-7xl font-extrabold p-5">Pengu BotList</h1>
        <p className="text-CadetGray text-xl font-medium">It's an incredible list of discord bots.</p>

        <div className="flex justify-center p-10">
          <input className="appearance-none block w-3/4 bg-Charcoal/30 border border-PayneGray/90 rounded-lg py-2 px-4 leading-tight focus:outline-none focus:bg-OuterSpace/40 text-CadetGray" type="text" placeholder="Search among more than 0 bots" />
        </div>
      </div>

      <div className="flex justify-center p-20">
        <div className="bg-Gunmetal/30 w-2/3 p-5 rounded-lg">
          <h3 className="text-PaynesGray text-4xl pl-10 font-bold">Some of the best bots</h3>
          <div>
              {
                data.map((data) => {
                  return (
                    <div className="flex justify-start m-10 p-3 bg-[#334146]/30 rounded-lg" key={data.name}>
                      <div className="pl-3 pr-10">
                        <Image className="rounded-lg min-w-[75px]" src={data.imageURL} alt={data.name} width={75} height={75} />
                      </div>
                      <div>
                        <p className="text-CadetGray text-xl font-bold">{data.name}</p>
                        <p className="text-PaynesGray font-semibold">{data.description}</p>
                      </div>
                    </div>
                  )
                })
              }
          </div>
        </div>
      </div>

    </div>
  )
}
