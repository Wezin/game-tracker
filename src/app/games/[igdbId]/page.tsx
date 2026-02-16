import { prisma } from "@/lib/prisma"; //Pull from database
import { notFound } from "next/navigation"; //show 404 page
import BackButton from "../BackButton";
import { getGameByIgdbId, igdbResizeImageUrl } from "@/lib/igdb";
import { addGameToLibrary, deleteGameFromLibrary } from "@/app/actions/library";
import { GameStatus } from "@prisma/client";
import { requireCurrentUser } from "@/lib/currentUser";


export default async function GamePage(
    { params }: { params: Promise<{igdbId: string}>}
) { 

    //get user
    const user = await requireCurrentUser();

    //Unwrap params
    const {igdbId: igdbIdStr} = await params;
    //Convert string into number    
    const igdbId = Number(igdbIdStr);

    //Number is not valid, 404
    if(!Number.isFinite(igdbId)) notFound();

    //Try to find game in db
    const dbGame = await prisma.game.findUnique({
        where: { igdbId },
    })

    //if game is already in db, null else, fetch it
    const igdbGame = dbGame 
        ? null 
        : await getGameByIgdbId(igdbId);
    
    //Assign game
    const game = dbGame ?? igdbGame

    //if game is not in igdb or game db, show 404
    if(!game) notFound(); 

    //Get proper date
    const releaseDateString = game.releaseDate 
        ? new Date(game.releaseDate).toDateString()
        : "Unknown"

    //Scale image
    const coverBig = game.coverUrl
        ? igdbResizeImageUrl(game.coverUrl, "t_1080p")
        : null;


    const userGame = dbGame ? await prisma.userGame.findUnique({
        where: { userId_gameId: {userId: user.id, gameId: dbGame.id} }
    }) 
    : null;

    const statusInLibrary = userGame?.status ?? null;
    
    //Game status highligher
    function statusButtonColours(target: GameStatus, active: GameStatus | null){
        const base = "rounded border p-2 text-2xl font-bold cursor-pointer";
        const inactive = "bg-black text-white border-gray-600";
        const activeMap: Record<GameStatus, string> = {
            PLAYING: "bg-yellow-400 text-black border-yellow-500",
            FINISHED: "bg-green-400 text-black border-green-500",
            BACKLOG: "bg-red-400 text-black border-red-500",
            DROPPED: "bg-yellow-400 text-black border-yellow-500",
        };
        return `${base} ${active === target ? activeMap[target] : inactive}`;
    }



    return (
        <main className="p-8 space-y-4"> {/*  */}
            <div className="flex items-center justify-between"> {/* Header Display */}
                <h1 className="text-2xl font-bold">{game.title}</h1> {/* Game Title */}
                <BackButton/>
                
            </div> 
            <div className="rounded border p-4 space-y-2 flex">
                <div className=""> {/* Game info section */}
                    <div className="text-sm text-gray-500"> {/* Temp section for game id */}
                        Game(igdb) ID: {igdbId} 
                    </div>

                    <div className="text-sm font-medium"></div> {/* Game Cover Art Section */}
                    {game.coverUrl ? (
                        <div className="mt-2 w-64 aspect-[3/4] overflow-hidden rounded border">
                            <img 
                                src={coverBig ?? ""} 
                                alt={`${game.title} cover`} 
                                className="w-full h-full object-cover" 
                            />  
                        </div>
                    ) : ( //if not image
                        <div className="mt-2 text-sm text-gray-500">No cover art</div>
                    )} 
                    
                    <div>{/* Game Description section */}
                        <div className="text-sm font-medium"> Description:</div> {/* Game Description section */}
                        <div className="text-sm text-gray-500">{game.description ?? "No description yet"}</div>
                    </div>

                    <div className="gird grid-cols-1 sm:gird-cols-2 gap-4"> {/* Responsive gird for metadata*/}
                        <div> {/* Game Release date section (IDK THE CLASS NAME STUFF) */}
                            <div className="text-sm font-medium">Release Date:</div>
                            <div className="text-sm text-gray-500">{releaseDateString}</div>
                        </div>

                        {/* Delte Game */}
                        {userGame ? ( //if game is in users library
                                <form action={deleteGameFromLibrary}>
                                    <input type="hidden" name="igdbGameId" value={igdbId} />
                                    <button 
                                        type="submit"
                                        name="toBeDeleted"
                                        value={userGame.gameId}
                                        className="text-sm underline cursor-pointer"   
                                    >
                                        Remove From Library
                                    </button>
                                </form>

                            ) : (
                                <p></p>
                            )}
                    </div>                 
                </div>
                <div> {/* Buttons */}
                    <form action={addGameToLibrary} className="flex gap-4 item-center">
                        <input type="hidden" name="strIgdbId" value={igdbId} />
                        <button 
                            type="submit"
                            name="status" 
                            value={"PLAYING"}
                            className={statusButtonColours(GameStatus.PLAYING, statusInLibrary)}
                            >Playing
                        </button>

                        <button 
                            type="submit"
                            name="status" 
                            value={"FINISHED"}
                            className={statusButtonColours(GameStatus.FINISHED, statusInLibrary)}
                            >Finished
                        </button>

                        <button 
                            type="submit"
                            name="status" 
                            value={"BACKLOG"}
                            className={statusButtonColours(GameStatus.BACKLOG, statusInLibrary)}
                            >Backlog
                        </button>
                        
                    </form>
                </div>
            </div> 
        </main>
    );
}
