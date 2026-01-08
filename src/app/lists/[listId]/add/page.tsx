

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getCurrentUser } from "@/lib/currentUser";
import { addGameToList } from "@/app/actions/lists";


export default async function AddGameToListPage(
    { params }: { params: Promise<{listId: string}> }
){
    const { listId } = await params;
    const user = await getCurrentUser();

    const list = await prisma.list.findFirst({
        where: { id: listId, userId: user.id },
    });

    const library = await prisma.userGame.findMany({
        where: { userId: user.id },
        include: { game: true },
        orderBy: { createdAt: "desc" },
    });

    const itemsInList = await prisma.listItem.findMany({ //store all items already in the list
        where: { listId },
        select: { gameId: true }, //get gameid
    });

    const gameIdsInlist = new Set( 
        itemsInList.map((x) => x.gameId)
    )

    return (
        <main className="p-8">
            <div> {/* Header */}
                <h1 className="text-2xl font-bold"> Add Games To "{list?.name}" List</h1>
                <Link className="Text-sm text-gray-500 underline" href={`/lists/${listId}`}>Done</Link>
            </div>
                {/* If not games, display the following */}
            {library.length === 0 ? (
                <p className="mt-4 text-gray-500"> No games yet. Click "Add Game" to add your first game</p> // If game list empty, display this prompt
                ) : (
                    <ul className="mt-6 space-y-3"> {/* List container */}
                        { library.map((entry) => {const alreadyInList = gameIdsInlist.has(entry.gameId); return (  //loop through eahc library entry
                            <li key={entry.id} className="rounded border p-4"> {/* Each entry section */}
                                <form action={addGameToList} className="">
                                    <input type="hidden" name="listId" value={listId}/> {/* Tells Server which listId */}
                                    <div className="text-2xl font-bold">{entry.game.title}</div>
                                    <div className="flex items-center justify-between"> {/* row layout left side */} 
                                        <div className="mt-2 flex gap-2"> {/* row of editable parameters */}
                                            <div className="rounded border px-2 py-1 text-sm">{entry.status}</div>
                                            <div className="font-semibold">{entry.platform}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between"> {/* row layout right side */}
                                        <div className="w-20 rounded border px-2 py-1 text-sm">{entry.hoursPlayed}h</div>   
                                        <div className="w-20 rounded border px-2 py-1 text-sm">{entry.progressPct}%</div>
                                        <div>
                                            {alreadyInList ? ( //If this entry is already in this list, replace the button to add it to list with span message
                                                <span className="text-sm text-gray-500">Already in list</span>
                                            ) : (<button 
                                                    type="submit" 
                                                    name="gameId" 
                                                    value={entry.gameId} 
                                                    className="rounded bg-black px-3 py-1 text-sm text-white cursor-pointer" >
                                                    Add Game
                                                </button>
                                            )}
                                        </div>                                                                                              
                                    </div>
                                </form>
                            </li>
                         );
                        })}
                    </ul>
                )}


        </main>

    )
        



}