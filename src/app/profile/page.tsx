import { requireCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { GameStatus, ActivityType } from "@prisma/client";
import { igdbResizeImageUrl } from "@/lib/igdb";
import { title } from "process";
import { includes } from "better-auth";
import { act, Activity } from "react";

export default async function ProfilePage() {


  const user = await requireCurrentUser();

  const userGames = await prisma.userGame.findMany({
    where: { userId: user.id},
  });

  //Favs
  const favs = await prisma.favouriteGame.findMany({
    where: { userId: user.id },
    include: {game: true},
    orderBy: {position: "asc"},
  });

  //make list of number of favs
  const numberOfFavs = favs.map((_,index) => index + 1);

  //Fav display cal
  const favsSorted = [...favs].sort((a, b) => a.position - b.position);
  const filledFavs = favsSorted.filter((f) => Boolean(f.gameId)); //keep only filled slots
  const displaySlots = [
    ...filledFavs.slice(0, 5),
    ...Array.from({ length: Math.max(0, 5 - filledFavs.length) }, () => null),
  ].slice(0,5);




  //List pinned
  const pList = await prisma.pinnedList.findMany({
    where: { userId: user.id },
    include: 
      {list: 
        {include: {
          _count: {select: {items: true}},
          items: {
            take: 4, //4 games
            include: {game: true},
            orderBy: {createdAt: "desc"},
          },
        },
      },
    },
    orderBy: {position: "asc"},
  });

  //Count variables
  let gamePlayingCount = 0;
  let backlogGamesCount = 0;
  let playedGamesCount = 0;
  userGames.map((f) => String(f.status) === "FINISHED" ? playedGamesCount++ : null );
  userGames.map((f) => String(f.status) === "BACKLOG" ? backlogGamesCount++ : null );
  userGames.map((f) => String(f.status) === "PLAYING" ? gamePlayingCount++ : null );

  //Activity details
  const activtyList = await prisma.activity.findMany({
    where: { userId: user.id },
    orderBy: {createdAt: "desc"},
    take: 3, //3 of the most recent actions
    include: {
      game: {
        select: {igdbId: true, title: true, coverUrl: true},
      },
      
    }
  });

  //Number of activities

  const ACTIVITY_TYPE = {
    FINISHED: `${user.name} has finished {{gameName}}`,
    PLAYING: `${user.name} has started playing {{gameName}}`,
    BACKLOG: `${user.name} has placed {{gameName}} in their backlog`,
    DROPPED: `gotta remove this ngl`,
  } as const;




  return (
    <main className="p-8">
      <div className="mx-auto max-w-6xl"> {/* Profile space (adjust later)*/}
        <div className="flex gap-4"> {/* Top | Personal Info */}
          {/* Profile Picture */}
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <Link className="mt-2 text-sm text-gray-500 underline cursor-pointer" href={"/profile/edit"}>Edit</Link>
          {/* Link for edit profile*/}
          {/* Number Of Friends */}
        </div>
        <div> {/* Personalized info */}
          <div> {/* Description */}
            <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap break-words">
              {user.bio}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-center gap-15"> {/* Stats */}
            <p className="text-sm ">{playedGamesCount} Played Games</p>
            <p className="text-sm ">{backlogGamesCount} Games In Backlog</p>
            <p className="text-sm ">{gamePlayingCount} Games In Current Rotation </p>
          </div>

          {/*Options bar*/}
          <div className="flex mt-3 w-full rounded border p-4 gap-10 items-center justify-center">
          <Link className="text-xl font-bold underline"href={"/profile"}>Profile</Link> 
          {/* <Link className="text-xl font-bold"href={"/lists"}>Lists</Link> 
          <p className="text-xl font-bold">Backlog</p> 
          <p className="text-xl font-bold">Finished</p> 
          <p className="text-xl font-bold">Playing</p>  */}
          {/* <p className="text-xl font-bold">Reviews</p>  */}
          </div>
            


          <div className="p-4"> {/* Profile display container */}
            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="flex-1 min-w-0"> {/* Left side */}

                <div className="mt-6"> {/* Display Fav Games */}
                  <div className="text-2xl font-medium mt-4">Favourite Games: </div>
                  <div className="mt-2 flex flex-wrap gap-4">
                    {numberOfFavs.length === 0 ? (
                      <Link 
                        className="rounde border w-500 min-h-[200px] flex 
                                  items-center justify-center text-xs text-gray-400
                                  underline text-center"
                        href={"/profile/edit"}
                      >
                        Display some of your favourite games
                      </Link>

                    ) : (
                      <div className="mt-2 flex flex-wrap gap-4">
                        {displaySlots.map((fav, i) => {

                          const coverBig = fav?.game.coverUrl ? igdbResizeImageUrl(fav.game.coverUrl, "t_cover_big") : null;

                          return (
                              <div key={fav?.id ?? `empty-${i}`}> {/* stable key for react */}
                                {fav ? (
                                  <Link href={`/games/${fav?.game.igdbId}`} className="group relative block">
                                  <div className="w-24 sm:w-28 md:w-32 aspect-[3/4] rounded overflow-hidden flex text-xs text-gray-500"
                                  >
                                    {coverBig ? (
                                      <img 
                                        src={coverBig} 
                                        alt={fav?.game.title ?? "Favourite Game"}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                      />
                                    ) : (
                                      <span className="m-auto">No Cover</span>
                                    )}
                                  </div>
                                </Link>
                                ) : ( //Empty slot
                                  <p></p>
                                )}
                              </div>
                          );
                        })}
                      </div>
                    )
                    }
                  </div>
                </div>
                {/* Display  Pinned Lists*/}     
                <div className="mt-6">
                  <div className="text-2xl font-medium mt-4">Pinned Lists:</div>
                  <div className="mt-4 flex ">
                    <div className="">
                      {pList.length === 0 ? (
                        <Link 
                          className="rounde border w-175 min-h-[200px] flex 
                                    items-center justify-center text-xs text-gray-400
                                    underline text-center"
                          href={"/profile/edit"}
                        >
                          Display some of your custom lists games
                        </Link>

                      ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {pList.map((p) => {
                          //const pLists = pList.find((f) => f.position === pos);
                            return (
                                <Link 
                                  key={p.id}
                                  href={`/lists/${p.listId}`} 
                                  className="block w-full max-w-xs rounded border p-4 "
                                >
                                  <div className="grid h-full grid-cols-3 gap-4"> {/* Top row of list card */}
                                        <div className="col-span-2 flex h-full flex-col"> {/* Allows text trunction layout to behave (DOUBLE CHECK) */}
                                            <div className="flex-1">
                                                  <div className="text-3xl font-bold leading-none">
                                                      {p.list.name}
                                                  </div>
                                                  <div className="mt-3 text-sm text-gray-500 line-clamp-2">
                                                      {p?.list.descirption ?? "No description"}
                                                  </div>  
                                            </div>

                                            <div className="mt-3"> {/* Bottom left */}
                                                  <div className="grid w-full grid-cols-2 gap-1">
                                                      {Array.from({ length: 4}).map((_, i) => {
                                                          const item = p?.list.items[i];
                                                          const rawCover = item?.game?.coverUrl ?? null;
                                                          const cover = rawCover ? igdbResizeImageUrl(rawCover, "t_cover_big") : null; 
                                                          
                                                          return (
                                                              <div key={i} className="aspect-square overflow-hidden rounded border">
                                                                  {cover ? (
                                                                      <img 
                                                                          src={cover} 
                                                                          alt={item?.game.title ?? "Game cover"}
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
                                            </div>    

                                        </div>
                                        <div className="col-span-1 flex h-full flex-col justify-between items-end text-right"> {/* right side */}
                                            <div className="space-y-2"> {/* top-right info */}
                                                <div className="text-lg font-semibold">
                                                    {p?.list._count.items}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {p?.list.isPublic ? "PU" : "PR"}
                                                </div>
                                            </div>
                                              {/*Dates*/}
                                              {/* <div className="mt-auto space-y-1 text-xs text-gray-500">
                                                <div>Created: {new Date(p.list.createdAt).toDateString()}</div> 
                                                  <div>Last Updated: {new Date(p.list.updatedAt).toDateString()}</div> 
                                              </div>  */}
                                        </div>
                                    </div>
                                </Link>
                            );
                          })}
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </div>
               {/* Right column */}           
              <aside className="mt-2 w-80 lg:w-60 lg:shrink-0 ">
                <div className="text-2xl font-medium mt-4">Recent Activity:</div>
                <div className="mt-4 space-y-3 text-sm text-gray-1000">
                  {activtyList.map((entry) => {

                    //Store to eventual replace gameName
                    const template = ACTIVITY_TYPE[entry.status]

                    //const activ = activtyList.find((a) => a);
                    const activityMessage = entry.type === "LIBRARY_ADD" 
                      ? `${user.name} has added ${entry.game.title} to thier Library`
                      : template.replace("{{gameName}}", entry.game.title);   

                    return (
                      <div key={entry.id}>
                        <Link 
                          className="text-sm text-gray-400" 
                          href={`/games/${entry.game.igdbId}`}
                        >
                          {activityMessage}
                          </Link>

                      </div>
                    )
                  })
                  }
                  
                </div>
              </aside>
            </div>
            {/*Pinned reviews*/}
          </div>
        </div>
      </div>
    </main>
  );
}