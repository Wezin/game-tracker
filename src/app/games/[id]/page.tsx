import Link from "next/link"; //Ability to use links
import { prisma } from "@/lib/prisma"; //Pull from database
import { notFound } from "next/navigation"; //show 404 page
import BackButton from "../BackButton";

export default async function GamePage(
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params; //await for id to be pulled from database
    const game = await prisma.game.findUnique({ //find game based on id
        where: { id }
    })

    if(!game) {
        console.log("Game not found")
        notFound() //show 404 page
    }

    return (
        <main className="p-8 space-y-4"> {/*  */}
            <div className="flex items-center justify-between"> {/* Header Display */}
                <h1 className="text-2xl font-bold">{game.title}</h1> {/* Game Title */}
                <BackButton/>
                
            </div> 

            <div className="rounded border p-4 space-y-2"> {/* Game info section */}
                <div className="text-sm text-gray-500"> {/* Temp section for game id */}
                    Game ID: {game.id} 
                </div>

                <div className="text-sm text-gray-500">Cover</div> {/* Game Cover Art Section */}
                {game.coverUrl ? (
                    <img src={game.coverUrl} alt={`${game.title} cover`} className="mt-2 w-48 rounded border" /> //show game image. If not image, 
                ): ( //if not image
                    <div className="mt-2 text-sm text-gray-500">No cover art yet</div>
                )} 
                <div>{/* Game Description section */}
                    <div className="text-sm font-medium"> Description:</div> {/* Game Description section */}
                    <div className="text-sm text-gray-500">{game.description ?? "No description yet"}</div>
                </div>

                <div className="gird grid-cols-1 sm:gird-cols-2 gap-4"> {/* Responsive gird for metadata*/}
                    <div> {/* Game Release date section (IDK THE CLASS NAME STUFF) */}
                        <div className="text-sm font-medium">Release Date:</div>
                        <div className="text-sm text-gray-500">{game.releaseDate ? game.releaseDate.toDateString() : "Unknown"}</div>
                    </div>

                    <div> {/* Game Developer block */}
                        <div className="text-sm font-medium">Developer</div>
                        <div className="text-sm text-gray-500">{game.developer ?? "No developer yet"}</div>
                    </div> 
                </div>                 
            </div> 
        </main>
    );
}
