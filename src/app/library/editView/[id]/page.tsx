import Link from "next/link"; //Allows usable links
import { prisma } from "@/lib/prisma"; //import prisma client to read DB
import { updateUserGame } from "@/app/actions/library";
import { getCurrentUser } from "@/lib/currentUser";

export default async function LibraryPage(
    { params }: { params: Promise<{id: string}> }
) { //async function for library page
    //get userGame id
    const {id} = await params;
    const user = await getCurrentUser();

    const library = user 
        ? await prisma.userGame.findMany({ //Users game list 
            where: { userId: user.id }, //Search specified user
            include: { game: true }, //Fetch game row for each entry
            orderBy: { createdAt: "desc" }, //order by most recently updated descending(desc) order
            })
        : [];

    return( //return library UI
        <main className="p-8"> {/* */}
            <div className="flex items-center justify-between"> {/* Header row layout */}
                <h1 className="text-2xl font-bold">My Library</h1> {/* Page title */}
                <Link className="underline" href="/library/add"> Add Game</Link> {/* Link to add game */}
            </div>
            {/* If not games, display the following */}
            {library.length === 0 ? (
                <p className="mt-4 text-gray-500"> No games yet. Click "Add Game" to add your first game</p> // If game list empty, display this prompt
                ) : (
                    <ul className="mt-6 space-y-3"> {/* List container */}
                        { library.map((entry) => {const gameInEditMode = entry.id === id; return( //loop through eahc library entry
                            <li key={entry.id} className="rounded border p-4"> {/* Each entry section */}
                                {gameInEditMode ? ( //If this game is to be edited
                                    <form action={updateUserGame} className="">
                                        <input type="hidden" name="userGameId" value={entry.id}/> {/* Tells Server which UserGame to Update*/}
                                        <div className="flex items-center justify-between"> {/* row layout left side */} 
                                            <Link href={`/games/${entry.game.id}`} className="font-semibold underlink">{entry.game.title}</Link> {/* Game title/link */}

                                            <div className="mt-2 flex gap-2"> {/* row of editable parameters */}
                                                <select //Status section
                                                    name="status" 
                                                    defaultValue={entry.status}
                                                    className="rounded border px-2 py-1 text-sm"
                                                >
                                                    <option value="BACKLOG" className="text-black">Backlog</option>
                                                    <option value="PLAYING" className="text-black">Playing</option>
                                                    <option value="FINISHED" className="text-black">Finished</option>
                                                    <option value="DROPPED" className="text-black">Dropped</option>   
                                                </select>

                                                <div className="font-semibold">{entry.platform}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center"> {/* row layout right side */}                                         
                                            <input  // Hours Played section
                                                type="number"
                                                name="hoursPlayed"
                                                defaultValue={entry.hoursPlayed} 
                                                min={0} 
                                                className="w-20 rounded border px-2 py-1 text-sm"                      
                                            />
                                            <span className="text-sm text-gray-500">h</span> {/*hour label*/}
                                            <input //Progress percent section
                                                type="number"
                                                name="progressPct"                                            
                                                defaultValue={entry.progressPct} 
                                                min={0}
                                                max={100}
                                                className="w-20 rounded border px-2 py-1 text-sm"                       
                                            />
                                            <span className="text-sm text-gray-500">%</span> {/*percent label*/}   
                                            <button type="submit" className="rounded bg-gray-500 px-3 py-1 text-sm text-white cursor-pointer">Save</button> {/* Submit Button*/}                                                        
                                        </div>
                                    </form>
                                    ):( //if this game is not to be edited
                                    <div>
                                        <input type="hidden" name="userGameId" value={entry.id}/> {/* Tells Server which UserGame to Update*/}
                                        <div className="flex items-center justify-between"> {/* row layout left side */} 
                                            <Link href={`/games/${entry.game.id}`} className="font-semibold underlink">{entry.game.title}</Link> {/* Game title/link */}

                                            <div className="mt-2 flex gap-2"> {/* row of editable parameters */}
                                                <div className="px-2 py-1 text-sm">{entry.status}</div>
                                                <div className="font-semibold">{entry.platform}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center"> {/* row layout right side */}                                         
                                            <div className="px-2 py-1 text-sm">{entry.hoursPlayed}h</div>
                                            <div className="px-2 py-1 text-sm">{entry.progressPct}%</div>
                                            <div className="text-sm text-gray-500">...in editing progress</div>                                                                                                  
                                        </div> 
                                    </div>    
                                )};      
                            </li>
                         )})}
                    </ul>
                )}
        </main>
    )
}

