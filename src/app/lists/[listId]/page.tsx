"user client";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation"; //show 404 page
import { requireCurrentUser } from "@/lib/currentUser";
import { removeGameFromList } from "@/app/actions/lists";
import { igdbResizeImageUrl } from "@/lib/igdb";


export default async function DisplayList(
    { params }: { params: Promise<{ listId: string }>} 

) {
    const { listId } = await params; //assign parameter(listId) to listId variable 
    const user = await requireCurrentUser(); //get current user



    const list = await prisma.list.findFirst({ //Give me an instance of list give the where paramaters(list and user id)
        where: { id: listId, userId: user.id },
        include: { items: {include: {game: true}} }, //include join rows (ListItem) to access the games
        orderBy: { updatedAt: "desc" },        
    });

    if(!list) notFound();

    //get game ids
    const gameIds = list.items.map((item) => item.gameId);

    const userGames = gameIds.length === 0 
        ?[] :
         await prisma.userGame.findMany({
            where: { userId: user.id, gameId: { in: gameIds } },
            select: {
                gameId: true,
                status: true,
                platform: true,
                hoursPlayed: true,
                progressPct: true,
            },
        });

    const userGameByGameId = new Map(
        userGames.map((ug) => [ug.gameId, ug])
    )
    
    return(
        <main className="p-8">
            <div className=""> {/* Header */}
                <h1 className="text-2xl font-bold">{list.name}</h1>
                <p className="text-sm text-gray-500">{list.descirption ?? "No description"}</p>
                <Link className="text-sm text-gray-500 underline" href={"/lists"}>Your Lists</Link>
            </div>

            {/* Games in list display */}
           <div className="mt-3 rounded border p-4">
            {list.items.length === 0 ? (
                    <p className="mt-6 text-gray-500">This list is empty</p>
            ) : (
                    <ul className="mt-6 space-y-3">
                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:gird-cols-7 gap-4">
                            {list.items.map((entry) => {
                                const ug = userGameByGameId.get(entry.gameId); //Current 
                                const cover = entry.game.coverUrl ? igdbResizeImageUrl(entry.game.coverUrl, "t_cover_big") : null; 
                                return (
                                    <li key={entry.id} className="p-4">
                                        {ug ? (

                                            <div>
                                                <Link 
                                                    key={entry.id}
                                                    href={`/games/${entry.game.igdbId}`}
                                                    className="group relative block pb-5"
                                                >
                                                    <div className={`aspect-[3/4] w-full overflow-hidden rounded-lg`}>
                                                        {cover ? (
                                                            <img 
                                                                src={cover} 
                                                                alt={entry.game.title}
                                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform" 
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full object-cover group-hover:scale-105 transition-transform">
                                                                No Cover
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                                <form action={removeGameFromList}> {/* Delete game option*/}
                                                    <input type="hidden" name="listId" value={listId}/>
                                                    <button type="submit" name="gameId" value={ug?.gameId} className="text-sm text-gray-500 underline cursor-pointer">Delete Game</button>
                                                </form> 
                                            </div>
                                            ) : ( //if not in users game library
                                                "Not in your library"                                                   
                                                )
                                        }                                  
                                    </li>
                                )
                            })}
                        </div>
                    </ul>
            )}
           </div>
            <div className="mt-7"> {/* Add and delete game option */}
                <Link className="text-sm text-gray-500 underline" href={`/lists/${listId}/add`}>Add Game To List</Link>
            </div>
        </main>

    
    )
}