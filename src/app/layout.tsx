import type { Metadata } from "next"; //import next.js page metadata
import Link from "next/link"; //import next.js links compoenet for fast navigation
import "./globals.css"; //import golbal css to apply styles

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
        <nav className="flex gap-4 border-b p-4"> {/*Nav acts as the top section of the webstie*/}
          <Link className ="font semibold hover:underline" href="/"> {/*Style the link*/}
            Home {/*Text the user sees as the link*/}
          </Link> 

          <Link className="font-semibold hover:underline" href="/library"> {/*Style the link*/}
            Library {/*Text the user sees as the link*/} 
          </Link>

          <Link className="font-semibold hover:underline" href="/lists"> {/*Style the link*/}
            Lists {/*Text the user sees as the link*/}
          </Link>

          <Link className="font-semibold hover:underline" href="/profile/testuser"> {/*Style the link*/}
            Profile {/*Text the user sees as the link*/}
          </Link>

          </nav>
          <main className="p-8"> {children}</main> 
          {/*Children = current page(Either link). p-8 the current page so it padded properly.
          What ever is the current page, rules of main apply to it*/}
      </body>
    </html>
  );
}
