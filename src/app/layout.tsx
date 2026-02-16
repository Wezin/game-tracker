import type { Metadata } from "next"; //import next.js page metadata
import Link from "next/link"; //import next.js links compoenet for fast navigation
import "./globals.css"; //import golbal css to apply styles
import { signOutAction } from "./actions/auth";

export const metadata: Metadata = { //exports defauly metadata(site info) for the whole app
  title: "GameTracker", //browser tab/page title
  description: "Track your backlog, progress and reviews.",
  
};

export default function RootLayout({ //App layout function
  children,
  
}:{
  children: React.ReactNode;
}) { //TypeScript for website

  return (
    <html lang="en">
      <body>
        <nav className="relative flex item-center border-b p-4"> {/*Nav acts as the top section of the webstie*/}
          
          <div className="flex gap-4"> {/* Left side page buttons */}
            <Link className ="font-semibold hover:underline" href="/home"> {/*Style the link*/}
            Home {/*Text the user sees as the link*/}
            </Link> 

            <Link className="font-semibold hover:underline" href="/library"> {/*Style the link*/}
              Library {/*Text the user sees as the link*/} 
            </Link>

            <Link className="font-semibold hover:underline" href="/games/search"> {/*Style the link*/}
              Search {/*Text the user sees as the link*/} 
            </Link>

            <Link className="font-semibold hover:underline" href="/lists"> {/*Style the link*/}
              Lists {/*Text the user sees as the link*/}
            </Link>

            <Link className="font-semibold hover:underline" href="/profile"> {/*Style the link*/}
              Profile {/*Text the user sees as the link*/}
            </Link>
          </div>
          
          {/*Cented demo message*/}
          <div className="absolute left-1/2 -translate-x-1/2 font-bold underline">Single-User Demo Version</div>

          <div className="ml-auto"> {/*Right side logout button*/}
            <form action={signOutAction}> 
              <button className="font-semibold hover:underline cursor-pointer">Log Out</button>
            </form>
          </div>
          


          </nav>
          <main className="p-8"> {children}</main> 
          {/*Children = current page(Either link). p-8 the current page so it padded properly.
          What ever is the current page, rules of main apply to it*/}
      </body>
    </html>
  );
}
