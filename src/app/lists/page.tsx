//List page(backlog, playing, wishlist, finsihed games)
//URL: http://localhot:3000/Lists


import Link from "next/link";
import { requireCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { removeList } from "@/app/actions/lists";

export default async function ListsPage() {
    const user = await requireCurrentUser();

    const lists = user ? //Assign list to lists if exists
        await prisma.list.findMany({
            where: { userId: user.id},
            include: {_count: { select: {items: true}}},
            orderBy: { updatedAt: "desc" },
        }) : []; 

    

    return (
        <main className="p-8">
            <div> {/*Header, link to create list form*/}
                <h1 className="text-2xl font-bold">Lists</h1>
                <Link className="mt-4 text-sm text-gray-500 underline" href="lists/add">Create List</Link>
            </div>
            { lists.length === 0 ? (<div className="mt-10 font-bold">Users has no custom lists</div>
            ) : (
                <ul className="mt-6 space-y-3"> {/* list of all custom lists */}
                    { lists.map((entry) => (
                        <li key={entry.id} className="rounded border p-4">
                            <div className="flex items-start justify-between"> {/* Top row of list card */}
                                <div className="min-w-0"> {/* Allows text trunction layout to behave (DOUBLE CHECK) */}
                                    <Link href={`/lists/${entry.id}`} className="flex h-full flex-col justify-between">
                                        <div className="text-lg font-semibold truncate">{entry.name}</div> {/* List name */}
                                    </Link> {/* Whole care is clickable */}
                                    <div className="mt-1 text-sm text-gray-500 line-clamp-2"> {/* List description */}
                                        {entry.descirption ?? "No description"}
                                    </div>
                                    <form action={removeList} className="">
                                        <button 
                                            type="submit" 
                                            name="listId" 
                                            value={entry.id} 
                                            className="text-sm text-gray-500 underline cursor-pointer">
                                            Delete List
                                        </button>    
                                    </form> 
                                </div>
                                <div className="flex flex-col items-end gap-2"> {/* right side */}
                                    <div className="text-sm text-gray-600">{entry._count.items} games</div> {/* Number of games in list */}
                                    <div className="text-sm text-gray-600">{entry.isPublic ? "PU" : "PR"}</div> {/* PU=public, PR=private */}
                                    <div className="text-xs text-gray-500">Created: {new Date(entry.createdAt).toDateString()}</div> {/* Date List was created */}
                                    <div className="text-xs text-gray-500">Last Updated: {new Date(entry.updatedAt).toDateString()}</div> {/* Date List was last updated */}
                                </div>
                            </div>            
                        </li>
                    ))}
                </ul>
            )};           
        </main>
    );
}