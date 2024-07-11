import Link from "next/link";
const LandingPage = () => {
    return (
        <div>
            Landing Page (Unprotected)
            <div className="flex items-center justify-center h-screen">
                <Link href="/sign-in">
                    <button className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Sign In
                    </button>
                </Link>
                <Link href="/sign-up">
                    <button className="bg-red-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Sign Up
                    </button>
                </Link>
            </div>
        </div>
    )
}
export default LandingPage;