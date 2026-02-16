//Make home page later
import Link from "next/link";
import { requireCurrentUser } from "@/lib/currentUser";
import { getManyGameByIgdbId, igdbResizeImageUrl } from "@/lib/igdb";


export default async function HomePage() {

    const user = await requireCurrentUser();

    const picks = [ 
        119133, //Elden Ring
        25076, //Red Dead 2
        7346, //Zelda
        1942, //Witcher
        365702, //Hollow Knigiht
        121, //MC
        305152, //E33
        1020, //GTA V
        136, //DMC 3
        1009,  //The Last Of Us
        1077, //mgs1
        1877, //Cyberpunk
    ];

    const gamesRaw = await getManyGameByIgdbId(picks);

    const byId = new Map(gamesRaw.map((g) => [g.id, g]));

    const games = picks
        .map((id) => byId.get(id))
        .filter((g): g is NonNullable<typeof g> => Boolean(g));
    //console.log(games);

    return (
        <main className="p-8">
            <div className="text-center"> {/* Headers */}
                <h1 className="text-4xl font-bold">Welcome To Your Own Personal Game's Library</h1>
                <p className="text-sm text-gray-400">A place to give life to your games library</p>
            </div>

            <div className="mt-15 flex items-center justify-center gap-25"> {/* info blocks */}
                <Link className="w-60 h-40 rounded border p-4 flex flex-col" href={"/library"}> {/* Library  Pitch */}
                    <h1 className="font-bold text-center">Games Library
                        <p className="mt-2 text-sm text-gray-500 font-medium text-center">
                            Build your own gaming library with a selection of over 900+ games.  
                        </p>
                    </h1>    
                </Link>
                <Link className="w-60 h-40 rounded border p-4 flex flex-col"  href={"/lists"}> {/* Lists  Pitch */}
                    <h1 className="font-bold text-center">Custom Lists
                        <p className="mt-2 text-sm text-gray-500 font-medium text-center">
                            Create custom lists to organize, track and catagorize your games however you see fit 
                        </p>
                        
                    </h1> 
                </Link>
                <Link className="w-60 h-40 rounded border p-4 flex flex-col" href={"/profile"}> {/* Profile Pitch */}
                    <h1 className="font-bold text-center">Personalized Profiles
                        <p className="mt-2 text-sm text-gray-500 font-medium text-center">
                            Express yourself by customizing your profile by displaying your favourite games and letting people know what you're about through your bio
                        </p>
                        
                    </h1> 
                </Link>
            </div>

            <div  className="mt-10"> {/* Trending Games */}
                <div className="flex items-end justify-between">
                    <h2 className="text-2xl font-bold">Popular Games</h2>
                    <Link className="text-sm text-gray-500 underline" href="/games/search">Search games</Link>
                </div>

                {games.length === 0 ? (
                    <p className="mt-4 text-sm text-gray-500">No featured Games found</p>
                ) : (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {games.map((g) => {
                            const coverBig = g.coverUrl ? igdbResizeImageUrl(g.coverUrl, "t_cover_big") : null;

                        
                        return (
                            <Link key={g.id} href={`/games/${g.id}`} className="group "> 
                                <div className="aspect-[3/4] overflow-hidden">
                                {coverBig ? (

                                    <img 
                                        src={coverBig} 
                                        alt={g.title}
                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform" 
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                                        No cover
                                    </div>
                                )}
                                </div>
                            </Link> 
                            );   
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}