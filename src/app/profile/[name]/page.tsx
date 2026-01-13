import { requireCurrentUser } from "@/lib/currentUser";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function ProfilePage() {


  const user = await requireCurrentUser();
  // Next.js provides "params" automatically for dynamic routes.
  // Because the folder is named [username], params.username exists.
  return (
    <main className="p-8">
      <div className="flex"> {/* Top | Personal Info */}
        {/* Profile Picture */}
        <h1 className="text-2xl font-bold">{user.name}</h1>
        {/* Link for edit profile*/}
        {/* Number Of Friends */}
      </div>
      <div className="flex m-3 w-full rounded border p-4 gap-10">
        <Link className="text-xl font-bold"href={"/lists"}>Lists</Link> {/* Change later. Profile specific */}
        <p className="text-xl font-bold">Backlog</p> {/* Implement later */}
        <p className="text-xl font-bold">Wishlist</p> {/* Implement later */}
        <p className="text-xl font-bold">Finished</p> {/* Implement later */}
        <p className="text-xl font-bold">Playing</p> {/* Implement later */}
        <p className="text-xl font-bold">Reviews</p> {/* Implement later */}
      </div>
    </main>
  );
}