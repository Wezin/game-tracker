import Link from "next/link";
import { redirect } from "next/navigation";
import { signUpAction } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/currentUser";

export default async function signUpPage(){

    return(
        <main className="p-8">
            <div className="center-container"> {/* Header */}
                <h1 className="text-4xl font-bold"> Welcome To Your Game's Library</h1>
                <p className="mt-1 text-1xl text-gray-300 font-medium">Register</p>
            </div>
            <form action={signUpAction} className="">
                <div> {/* Name */}
                    <label className="text-2xl font-bold">Name:  </label>
                    <input 
                        type="text"
                        name="name"
                        placeholder="john Doe"
                        className="mt-5 w-60 rounded border p-1" 
                        required
                    />
                </div>
                <div className=""> {/* Email */}
                    <label className="text-2xl font-bold">Email:  </label>
                    <input 
                        type="text"
                        name="email"
                        placeholder="gamelibrary@example.com"
                        className="mt-5 w-60 rounded border p-1" 
                        required
                    />
                </div>
                
                <div> {/* Password */}
                    <label className="text-2xl font-bold">Password:  </label>
                    <input 
                        type="password"
                        name="password"
                        className="mt-5 w-60 rounded border p-1" 
                        required
                    />
                </div>
                <button 
                    type="submit"
                    className="text-sm text-gray-500 underline cursor-pointer"
                >
                    Sign-Up
                </button>
                <div className="mt-10"> {/* Sign up button */}
                    <p className="text-sm">Already have an account?</p>
                    <Link className="text-sm text-gray-500 underline cursor-pointer" href={"/sign-in"}>sign-in</Link>
                </div>
            </form>
        </main>

    )

}