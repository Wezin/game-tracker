import { requireCurrentUser } from "@/lib/currentUser";


export default async function ProfilePage() {


  const user = await requireCurrentUser();
  // Next.js provides "params" automatically for dynamic routes.
  // Because the folder is named [username], params.username exists.
  return (
    <main className="p-8">
      {/* Show the username from the URL */}
      <h1 className="text-2xl font-bold">@{user.name}</h1>

      <p className="mt-2 text-gray-500">
        Public profile page (lists + reviews).
      </p>
    </main>
  );
}