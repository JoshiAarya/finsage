"use client"
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-white text-xl font-bold hover:underline">
            Home
          </Link>
          <Link href="/transactions" className="text-white hover:underline">
            Add Transaction
          </Link>
          <Link href="/profile" className="text-white hover:underline">
            Profile
          </Link>
        </div>

        <div>
          {status === "loading" ? (
            <span className="text-white">Loading...</span>
          ) : session ? (
            <button
              onClick={() => signOut()}
              className="bg-white text-blue-600 font-semibold px-4 py-1 rounded hover:bg-gray-200"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-white text-blue-600 font-semibold px-4 py-1 rounded hover:bg-gray-200"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
