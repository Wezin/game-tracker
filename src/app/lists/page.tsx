//List page(backlog, playing, wishlist, finsihed games)
//URL: http://localhot:3000/Lists


import Link from "next/link";
import { requireCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { igdbResizeImageUrl } from "@/lib/igdb";
import { removeList } from "../actions/lists";

export default async function ListsPage() {
    const user = await requireCurrentUser();

    const lists = await prisma.list.findMany({ ///Fetch all lists
            where: { userId: user.id},
            include: {
                _count: { select: {items: true}},
                items: {
                    take: 4,
                    orderBy: { createdAt: "desc"},
                    include: { game: true },
                },
            },
            orderBy: { updatedAt: "desc" },
        }); 

    

    return (
        <main className="p-8">
            <div> {/*Header, link to create list form*/}
                <h1 className="text-2xl font-bold">Lists</h1>
                <Link className="mt-4 text-sm text-gray-500 underline" href="lists/add">Create List</Link>
            </div>
            { lists.length === 0 ? (<div className="mt-10 font-bold">Users has no custom lists</div>
            ) : (
                <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"> {/* list of all custom lists */}
                    { lists.map((entry) => (
                        <li key={entry.id} className="rounded border p-4">
                            <div className="grid h-full grid-cols-3 gap-4"> {/* Top row of list card */}
                                <div className="col-span-2 flex h-full flex-col justify-between"> {/* Allows text trunction layout to behave (DOUBLE CHECK) */}
                                    <div className="flex-1 flex flex-col justify-center">
                                        <Link href={`/lists/${entry.id}`} className="block">
                                            <div className="text-3xl font-bold leading-none">
                                                {entry.name}
                                            </div>
                                            <div className="mt-3 text-sm text-gray-500 line-clamp-2">
                                                {entry.descirption ?? "No description"}
                                            </div>
                                        </Link>
                                    </div>

                                    <div className="mt-4 flex-1 flex flex-col justify-end"> {/* Bottom left */}
                                        <Link href={`/lists/${entry.id}`} className="block"> 
                                            <div className="grid w-full grid-cols-2 gap-1">
                                                {Array.from({ length: 4}).map((_, i) => {
                                                    const item = entry.items[i];
                                                    const rawCover = item?.game?.coverUrl ?? null;
                                                    const cover = rawCover ? igdbResizeImageUrl(rawCover, "t_cover_big") : null; 
                                                    
                                                    return (
                                                        <div key={i} className="aspect-square overflow-hidden rounded border">
                                                            {cover ? (
                                                                <img 
                                                                    src={cover} 
                                                                    alt={item.game.title ?? "Game cover"}
                                                                    className="h-full w-full object-cover" 
                                                                />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                                                                        Empty
                                                                    </div>
                                                                )}
                                                        </div>
                                                    );
                                                })}
                                            </div>                                    
                                        </Link>

                                        <form action={removeList} className="mt-2">
                                            <button
                                                type="submit"
                                                name="listId"
                                                value={entry.id}
                                                className="text-xs text-gray-500 underline cursor-pointer"
                                            >
                                                Delete List
                                            </button>
                                        </form>
                                    </div>    

                                </div>

                                
                                <div className="col-span-1 flex h-full flex-col justify-between items-end text-right"> {/* right side */}
                                    <div className="space-y-2"> {/* top-right info */}
                                        <div className="text-lg font-semibold">
                                            {entry._count.items}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {entry.isPublic ? "PU" : "PR"}
                                        </div>
                                    </div>

                                    <div className="space-y-1 text-[10px] text-gray-500">
                                        <div>Created: {new Date(entry.createdAt).toDateString()}</div> {/* Date List was created */}
                                        <div>Last Updated: {new Date(entry.updatedAt).toDateString()}</div> {/* Date List was last updated */}
                                    </div>
                                </div>
                            </div>            
                        </li>
                    ))}
                </ul>
            )}           
        </main>
    );
}