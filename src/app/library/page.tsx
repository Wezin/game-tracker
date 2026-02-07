import Link from "next/link"; //Allows usable links
import { prisma } from "@/lib/prisma"; //import prisma client to read DB
import { requireCurrentUser } from "@/lib/currentUser";
import { GameStatus } from "@prisma/client";
import { igdbResizeImageUrl } from "@/lib/igdb";
// import { useState } from "react";


export default async function LibraryPage(
    { searchParams }: { searchParams: Promise<{ status?: string }> }
) { //async function for library page
    
    //Get user
    const user = await requireCurrentUser();

    //Get search param
    const tempParam = await searchParams;

    //Upper case string, default to all
    const rawStatus = (tempParam.status ?? "ALL").toUpperCase(); 

    //checkValid is true of rawStatus is equal to all or if rawstatus is one of the statuses in GameStatus
    const checkValid = rawStatus === "ALL" || Object.values(GameStatus).includes(rawStatus as GameStatus);
    //if rawStatus is not all, 
    const statusFilter = checkValid && rawStatus !== "ALL" ? (rawStatus as GameStatus) : null;

    const library =  await prisma.userGame.findMany({
        where: { userId: user.id, 
            ...(statusFilter ? {status: statusFilter} : {}) //statusFilter only if not null (User chose)
        },
        include: { game: true },
        orderBy: { createdAt: "desc" },
    });

    //colour coding
    const STATUS_STYLE = {
        PLAYING: {border: "border-yellow-500", badge: "bg-yellow-500", label: "Playing"},
        FINISHED: {border: "border-green-500", badge: "bg-green-500", label: "Finished"},
        BACKLOG: {border: "border-red-500", badge: "bg-red-500", label: "Backlog"},
        DROPPED: {border: "border-red-500", badge: "bg-red-500", label: "backlog"}
    } as const;

    return( //return library UI
        <main className="p-8"> {/* */}
            <div className="flex items-center justify-between"> {/* Header row layout */}
                <h1 className="text-2xl font-bold">My Library</h1> {/* Page title */}
                <Link className="underline" href="/games/search"> Add Game</Link> {/* Link to add game */}
            </div>
            <div className="flex gap-4"> {/* Filtering */}
                <Link 
                    className={`font-medium ${rawStatus === "ALL" ? "underline" : ""}`} //underline active filter
                    href="/library?status=ALL"
                >
                    All
                </Link>

                <Link 
                    className={`font-medium ${rawStatus === "PLAYING" ? "underline" : ""}`}
                    href="/library?status=PLAYING"
                >
                    Playing
                </Link>

                <Link 
                    className={`font-medium ${rawStatus === "FINISHED" ? "underline" : ""}`}
                    href="/library?status=FINISHED"
                >
                    Finished
                </Link>

                <Link 
                    className={`font-medium ${rawStatus === "BACKLOG" ? "underline" : ""}`}
                    href="/library?status=BACKLOG"
                >
                    Backlog
                </Link>


            </div>
            {/* If not games, display the following */}
            {library.length === 0 ? (
                <p className="mt-4 text-gray-500"> No games yet. Click "Add Game" to add your first game</p> // If game list empty, display this prompt
                ) : (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:gird-cols-7 gap-4">
                        {library.map((entry) => {
                            const style = STATUS_STYLE[entry.status] ?? {border: "border-gray-300", badge: "bg-gray-300", label: String(entry.status) };
                            const cover = entry.game.coverUrl ? igdbResizeImageUrl(entry.game.coverUrl, "t_cover_big") : null;

                            return (
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
                                    <div 
                                        className={`absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold text-white ${style.badge}`}
                                    >
                                        {style.label}
                                    </div>
                                </Link>
                            )
                        })}



                    </div>
                )}
        </main>
    )
}

