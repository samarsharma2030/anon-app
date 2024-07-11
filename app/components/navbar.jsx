import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import useFetchInteractionRequests from '../hooks/useFetchInteractionRequests';
import InteractionRequests from "./InteractionRequests"; // Adjust the path accordingly

function Navbar({ onAccept }) {
  const { isLoaded, user } = useUser();
  const interactionRequests = useFetchInteractionRequests();

  // Count the number of pending requests
  const pendingRequestsCount = interactionRequests.length;

  return (
    <nav className="top-0 mx-auto flex w-full max-w-screen-2xl items-center justify-between bg-gray-300 p-4 dark:bg-slate-950 shadow-sm">
      <Link href="/home" className="flex items-center">
        <div className="relative mr-4 h-10 w-10">
          <h1 className='mt-1 text-xl font-bold text-primary text-3xl'>AP</h1>
        </div>
      </Link>
      <div className="flex items-center mr-[40px] font-bold font-mono uppercase text-fuchsia-950 underline decoration-orange-800 decoration-4 underline-offset-1 text-lg text-center">
        {!isLoaded ? (
          <span>Loading...</span>
        ) : (
          <span>{user.publicMetadata.nickname}</span>
        )}
      </div>
      <div className="flex items-center justify-end relative group">
        <UserButton afterSignOutUrl="/" />
        <div className="ml-4 relative">
          <button className="relative">
            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v5H3a1 1 0 000 2h14a1 1 0 000-2h-1V8a6 6 0 00-6-6zM6 16a2 2 0 004 0H6z" />
            </svg>
            {pendingRequestsCount > 0 && (
              <span className="absolute top-0 right-0 inline-block w-4 h-4 text-xs font-bold text-center text-white bg-red-500 rounded-full">
                {pendingRequestsCount}
              </span>
            )}
          </button>
          <div className="interaction-requests-dropdown absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 hidden group-hover:block">
            <InteractionRequests onAccept={onAccept}/>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
