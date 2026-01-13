"user client";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation"; //show 404 page
import { requireCurrentUser } from "@/lib/currentUser";
import { removeGameFromList } from "@/app/actions/lists";


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
           
           {list.items.length === 0 ? (
                <p className="mt-6 text-gray-500">This list is empty</p>
           ) : (
                <ul className="mt-6 space-y-3">
                    {list.items.map((item) => {
                        const ug = userGameByGameId.get(item.gameId); //Current 
                        return (
                            <li key={item.id} className="rounded border p-4">
                                <div className="flex items-start justify-between"> 
                                    <div> {/* left side */}
                                        <Link className="text-lg font-semibold" href={`/games/${item.game.id}`}>{item.game.title}</Link> {/* Game Title */}
                                        

                                        <div className="mt-1 text-sm text-gray-500"> {/* game status/platform */}
                                            {ug ? 
                                                (<>
                                                    {ug.status} 
                                                    {ug.platform ? ` * ${ug.platform}` : ""}
                                                </>
                                                ) : ( //if not in users game library
                                                    "Not in your library"                                                   
                                                    )
                                            }
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-500"> {/* Right side */}
                                        {ug ? (

                                            <>
                                                {ug.hoursPlayed}h | {ug.progressPct}% {/* display hours and progress */}
                                            </>
                                        ) : (
                                            "-" //placeholder if theses stats dont exist 
                                        )
                                        }
                                        <form action={removeGameFromList}> {/* Delete game option*/}
                                            <input type="hidden" name="listId" value={listId}/>
                                            <button type="submit" name="gameId" value={ug?.gameId} className="text-sm text-gray-500 underline cursor-pointer">Delete Game</button>
                                        </form>    
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
           )}
            <div className="mt-7"> {/* Add and delete game option */}
                <Link className="text-sm text-gray-500 underline" href={`/lists/${listId}/add`}>Add Game To List</Link>
            </div>
        </main>

    
    )
}