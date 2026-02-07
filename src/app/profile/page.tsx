import { requireCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { GameStatus } from "@prisma/client";
import { igdbResizeImageUrl } from "@/lib/igdb";

export default async function ProfilePage() {


  const user = await requireCurrentUser();

  const userGames = await prisma.userGame.findMany({
    where: { userId: user.id},
  });

  const favs = await prisma.favouriteGame.findMany({
    where: { userId: user.id },
    include: {game: true},
    orderBy: {position: "asc"},
  });

  //Count variables
  let gamePlayingCount = 0;
  let backlogGamesCount = 0;
  let playedGamesCount = 0;
  userGames.map((f) => String(f.status) === "FINISHED" ? playedGamesCount++ : null );
  userGames.map((f) => String(f.status) === "BACKLOG" ? backlogGamesCount++ : null );
  userGames.map((f) => String(f.status) === "PLAYING" ? gamePlayingCount++ : null );


  // Next.js provides "params" automatically for dynamic routes.
  // Because the folder is named [username], params.username exists.
  return (
    <main className="p-8">
      <div className="mx-auto max-w-4xl"> {/* Profile space (adjust later)*/}
        <div className="flex gap-4"> {/* Top | Personal Info */}
          {/* Profile Picture */}
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <Link className="mt-2 text-sm text-gray-500 underline cursor-pointer" href={"/profile/edit"}>Edit</Link>
          {/* Link for edit profile*/}
          {/* Number Of Friends */}
        </div>
        <div> {/* Personalized info */}
          <div> {/* Description */}
            <p className="text-sm text-gray-500 mt-4">{user.bio}</p>
          </div>
          <div className="mt-4 flex items-center justify-center gap-15"> {/* Stats */}
            <p className="text-sm ">{playedGamesCount} Played Games</p>
            <p className="text-sm ">{backlogGamesCount} Games In Backlog</p>
            <p className="text-sm ">{gamePlayingCount} Games In Current Rotation </p>
          </div>

          {/*Options bar*/}
          <div className="flex mt-3 w-full rounded border p-4 gap-10 items-center justify-center">
          <Link className="text-xl font-bold"href={"/profile"}>Profile</Link> 
          <Link className="text-xl font-bold"href={"/lists"}>Lists</Link> 
          <p className="text-xl font-bold">Backlog</p> 
          <p className="text-xl font-bold">Finished</p> 
          <p className="text-xl font-bold">Playing</p> 
          <p className="text-xl font-bold">Reviews</p> 
          </div>
          {/* Display fav games */}
          <div className="mt-6"> 
            <div className="text-2xl font-medium mt-4">Favourite Games: </div>
            <div className="mt-2 flex gap-3">
              {[1, 2, 3, 4, 5].map((pos) => {
                const fav = favs.find((f) => f.position === pos);

                const coverBig = fav?.game.coverUrl ? igdbResizeImageUrl(fav.game.coverUrl, "t_cover_big") : null;

                return (
                  
                    <div key={pos}>
                      <Link href={`/games/${fav?.game.igdbId}`} className="group relative block">
                        <div className="w-full aspect-[3/4] rounded border overflow-hidden flex text-xs text-gray-500"
                        >
                          {coverBig ? (
                            <img 
                              src={coverBig} 
                              alt={fav?.game.title ?? "Favourite Game"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            />
                          ) : (
                            <span>Empty</span>
                          )}
                        </div>
                      </Link>

                    </div>
                );
              })}
            </div>
          </div>
          {/* Display  */}     
          <div className="mt-6">
            <div className="text-2xl font-medium mt-4">Pinned Lists</div>


          </div>


        </div>
      </div>
    </main>
  );
}