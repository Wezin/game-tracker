import { getCurrentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function HomePage(){
  const user = await getCurrentUser();
  redirect(user ? "/home" : "/sign-in"); //redirect user based on if a user is signed in or not 
}
