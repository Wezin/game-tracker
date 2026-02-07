import { editAccount } from "@/app/actions/profile";
import { requireCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function editProfilePage(){

    const user = await requireCurrentUser();

    //Get user's library
    const library = await prisma.userGame.findMany({
        where: {userId: user.id},
        include: {game: true},
        orderBy: {createdAt: "desc"},
    });

    //Get users favourite games
    const favourites = await prisma.favouriteGame.findMany({
        where: { userId: user.id},
        select: { position: true, gameId: true },
    }); 

    const favPosition = new Map<number, string>(); //Map postion gameId 
    for (const f of favourites) favPosition.set(f.position, f.gameId); //Fill map with DB rows

    return(
        <main className="p-8">
            <div> {/* Header */}
                <h1 className="text-2xl font-bold">Edit Profile</h1>
                <Link className="text-sm text-gray-500 underline" href={"/profile/edit/password"}>Change Password</Link>
                
                
            </div>
            <form action={editAccount}>
                <div className=""> {/* Change name */}
                    <label>Name:  </label>
                    <input 
                        type="text"
                        name="newName"
                        defaultValue={String(user.name)}
                        placeholder="John"
                        className="mt-3 mt-1 w-50 rounded border p-0.5"
                    />
                </div>
                <div className="">  {/* Change bio */}
                    <label htmlFor="bio" className="block ">Bio:  </label>
                    <textarea 
                        name="bio"
                        rows= {5}
                        placeholder="I started playing games at 8 and I play on PC..."
                        className="-mt-5 w-60 rounded border p-0.5 ml-13"
                    ></textarea>
                </div>
                <div> {/* Store favourite Games */}
                    <div className="text-sm font-medium">Favourite Games (Top 5)</div>
                    <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-x1">
                        {[1, 2, 3, 4, 5].map((pos) => (
                            <div key={pos} className="rounded border p-5">
                                <div className="text-xs text-gray-500">Slot {pos}</div>

                                <select 
                                    name={`fav${pos}GameId`} 
                                    defaultValue={favPosition.get(pos) ?? ""}
                                    className="text-black-500 mt-2 w-full rounded border p-2"
                                >
                                    <option value="">(Empty)</option>
                                    {library.map((entry) => (
                                        <option className="text-black" key={entry.game.id} value={entry.game.id}>{entry.game.title}</option>
                                    ))}
                                    </select>
                            </div>
                        ))}
                    </div>
                </div>
                <button type="submit" className="text-sm text-gray-500 underline cursor-pointer">Submit</button>
            </form>


        </main>

    )


}