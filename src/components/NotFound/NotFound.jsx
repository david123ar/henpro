"use client"
import Link from "next/link";
import Navbar from "../Navbar/Navbar";
import Footer from "../footer/Footer";

export default function NotFound() {
    return (
        <>
            <SessionProvider>
                <Navbar now={false} />
                <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
                    <h1 className="text-4xl font-bold mb-4">404 - User Not Found 😔</h1>
                    <p className="text-gray-400 mb-6 text-center">
                        Sorry, we couldn’t find the page or user you’re looking for.
                    </p>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-[#FF9741] hover:bg-[#ffac67] text-white rounded-2xl transition-all"
                    >
                        Return to Home
                    </Link>
                </div>
                <Footer />
            </SessionProvider>
        </>
    );
}
