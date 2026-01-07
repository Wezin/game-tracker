//Library page
//URL: http://localhot:3000/library

// export default function Library() {

//     return (
//         <main className="p-8">
//             {/* Big header */}
//             <h1 className="text-2xl font-bold">My Library</h1>

//             {/* Smaller grey text below the header */}
//             <p className="mt-2 text-gray-500">
//                 Your saved games will appear here.
                
//             </p>
//         </main>
//     );
// }


import Link from "next/link"; //Allows usable links
import { prisma } from "@/lib/prisma"; //import prisma client to read DB
import { updateUserGame } from "@/app/actions/library";

const DEMO_EMAIL = "demo@gametracker.local"; //store temp demo email for demo user

export default async function LibraryPage() { //async function for library page
    const user = await prisma.user.findUnique({ //find user with DMEO_EMAIL
        where: { email: DEMO_EMAIL },
    });

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
                                                <option value="BACKLOG">Backlog</option>
                                                <option value="PLAYING">Playing</option>
                                                <option value="FINISHED">Finished</option>
                                                <option value="DROPPED">Dropped</option>   
                                            </select>

                                            <div className="font-semibold">{entry.platform}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between"> {/* row layout right side */}                                         
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
                                        <button type="submit" className="rounded bg-black px-3 py-1 text-sm text-white">Save</button> {/* Submit Button*/}                                                        
                                    </div>
                                </form>
                            </li>
                         ))}
                    </ul>
                )}
        </main>
    )
}

