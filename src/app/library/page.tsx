import Link from "next/link"; //Allows usable links
import { prisma } from "@/lib/prisma"; //import prisma client to read DB
import { requireCurrentUser } from "@/lib/currentUser";

export default async function LibraryPage() { //async function for library page
   
    const user = await requireCurrentUser();

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
                        { library.map((entry) => ( //loop through eahc library entry
                            <li key={entry.id} className="rounded border p-4"> {/* Each entry section */}
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
                                    <Link className="rounded bg-gray-500 px-3 py-1 text-sm text-white cursor-pointer" href={`/library/editView/${entry.id}`}>Edit</Link> {/* Submit Button*/}                                                        
                                </div>
                            </li>
                         ))}
                    </ul>
                )}
        </main>
    )
}

