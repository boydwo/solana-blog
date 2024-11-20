/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { PhantomWalletName } from "@solana/wallet-adapter-wallets";
import { useEffect, useState } from "react";
import { Button } from "./components/button";
import Footer from "./components/footer";
import { useBlog } from "./context/blog";
export default function Main() {

  const [connecting, setConnecting] = useState(false)
  const { connected, select } = useWallet()
  const { user, initUser, initialized } = useBlog()

  const posts: any[] = []
  const loading = false
  // const [postTitle, setPostTitle] = useState("")
  // const [postContent, setPostContent] = useState("")

  const onConnect = () => {
    setConnecting(true)
    select(PhantomWalletName)
  }

  useEffect(() => {
    console.log("User", user)
    if (user) {
      setConnecting(false)
    }
  }, [user])

  return (
    <div>
       <header className="fixed z-10 w-full h-14 bg-indigo-700 shadow-md">
      <div className="flex justify-between items-center h-full container px-6">
        {/* Logo */}
        <h2 className="text-2xl font-bold text-white">
          <div className="bg-clip-text bg-gradient-to-br from-indigo-300">
            BLOGSOL
          </div>
        </h2>

        {/* Conexão */}
        {connected ? (
          <div className="flex items-center">
          { user && (<img
              src={user?.avatar || ""}
              alt="avatar"
              className="w-8 h-8 rounded-full bg-gray-200 shadow ring-2 ring-indigo-400 ring-offset-2 ring-opacity-50"
            />)}
            <p className="font-bold text-sm ml-2 capitalize text-white">
              {user?.name}
            </p>
            {initialized ? (
              <Button
                className="ml-3 mr-2 bg-indigo-500 hover:bg-indigo-900 text-white"
                onClick={() => {
                  alert("Create Post modal here!");
                }}
              >
                Create Post
              </Button>
            ) : (
              <Button
                className="ml-3 mr-2 bg-indigo-500 hover:bg-indigo-900 text-white"
                onClick={() => {
                  initUser()
                }}
              >
                Initialize User
              </Button>
            )}
          </div>
        ) : (
          <Button
            loading={connecting}
            className="w-28 bg-indigo-500 hover:bg-indigo-900 text-white"
            onClick={onConnect}
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            }
          >
            Connect
          </Button>
        )}
      </div>
    </header>
    
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Latest Posts</h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Use placeholder image for now */}
                  <img
                    src="https://via.placeholder.com/300"
                    alt={post.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm">{post.content}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      Posted by: {post.user.slice(0, 6)}...
                      {post.user.slice(-4)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No posts available.</p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}