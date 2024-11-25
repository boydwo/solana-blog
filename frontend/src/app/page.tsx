"use client";

import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PhantomWalletName } from "@solana/wallet-adapter-wallets";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from './assets/sol-logo.png';
import { Button } from "./components/button";
import Footer from "./components/footer";
import { useBlog } from "./context/blog";
export default function Main() {
  const [connecting, setConnecting] = useState(false);
  const { connected, select, disconnect,  } = useWallet();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const { user, posts, initUser, initialized, createPost, showModal: isModalOpen, setShowModal:setIsModalOpen } = useBlog();
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  const loading = false;

  const onConnect = () => {
    setConnecting(true);
    select(PhantomWalletName);
  };

  const handleInitUser = async () => {
    if (userName.trim() === "") {
      alert("Name is required!");
      return;
    }
  
    try {
      await initUser(userName);
      setIsUserModalOpen(false);
    } catch (error) {
      console.error("Error initializing user:", error);
    }
  };

  const handleCreatePost = async () => {
    if (postTitle && postContent) {
      console.log("postTitle...",postTitle);
      console.log("postContent...",postContent);
      
      await createPost(postTitle, postContent);
      setPostTitle("");
      setPostContent("");
      setIsModalOpen(false);
    } else {
      alert("Title and content are required!");
    }
  };

  useEffect(() => {
    console.log("User", user);
    if (user) {
      setConnecting(false);
    }
  }, [user, posts]);

  return (
    <div>
      <header className="fixed z-10 w-full h-14 bg-indigo-700 shadow-md">
        <div className="flex justify-between items-center h-full container px-6">
          <h2 className="flex text-2xl font-bold text-white">
            <Image
              alt=""
              src={logo}
              className="h-10 w-auto ml-8"
            />
            <div className="hidden lg:block  ml-8 bg-clip-text bg-gradient-to-br from-indigo-300">
              BLOGSOL
            </div>
          </h2>
          {connected ? (
            <div className="flex items-center">
              {user && (
                <img
                  src={user?.avatar || ""}
                  alt="avatar"
                  className="w-8 h-8 rounded-full bg-gray-200 shadow ring-2 ring-indigo-400 ring-offset-2 ring-opacity-50"
                />
              )}
              <p className="font-bold text-sm ml-2 capitalize text-white">
                {user?.name}
              </p>
              {initialized ? (
                <>
                  <Button
                    className="ml-3 mr-2 bg-indigo-500 hover:bg-indigo-900 text-white"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Create Post
                  </Button>
                  <Button
                    className="ml-3 mr-2 bg-indigo-500 hover:bg-indigo-900 text-white"
                    onClick={disconnect}
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button
                  className="ml-3 mr-2 bg-indigo-500 hover:bg-indigo-900 text-white"
                  onClick={() => {
                    setIsUserModalOpen(true);
                  }}
                >
                  Initialize User
                </Button>
              )}
            </div>
          ) : (
            <Button
              loading={connecting}
              className="w-42 bg-indigo-500 hover:bg-indigo-900 text-white"
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
              Connect your Wallet
            </Button>
          )}
        </div>
      </header>

      <section className="py-10 bg-gray-100 min-h-[788px]">
        <div className="mt-12 container mx-auto px-4 mar">
          {loading ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : posts.length > 0 ? (
            <ul className="space-y-8">
              {posts.map((post: any, index: number) => (
                <li
                  key={index}
                  className="flex items-start gap-4 bg-white shadow-md rounded-lg p-4"
                >
                  <div>
                    <h3 className="text-gray-800 text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm">{post.content}</p>
                    <p className="text-gray-300 text-xs mt-2">
                      Posted by: {post.user.slice(0, 6)}...
                      {post.user.slice(-4)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No posts available.</p>
          )}
        </div>
      </section>

      {/* Modal */}
      <Transition show={isModalOpen}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClose={() => setIsModalOpen(false)}
        >
          <DialogPanel className="bg-white rounded-lg shadow-md max-w-md w-full p-6">
            <h2 className="text-gray-800 text-2xl font-semibold mb-4">Create a Post</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                className="text-gray-600 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                className="text-gray-600 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-gray-300 text-gray-700 hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="ml-3 bg-indigo-500 hover:bg-indigo-900 text-white"
                onClick={handleCreatePost}
              >
                Save
              </Button>
            </div>
          </DialogPanel>
        </Dialog>
      </Transition>
      <Transition show={isUserModalOpen}>
  <Dialog
    as="div"
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    onClose={() => setIsUserModalOpen(false)}
  >
    <DialogPanel className="bg-white rounded-lg shadow-md max-w-md w-full p-6">
      <h2 className="text-gray-800 text-2xl font-semibold mb-4">
        Initialize User
      </h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          className="text-gray-600 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <Button
          className="bg-gray-300 text-gray-700 hover:bg-gray-400"
          onClick={() => setIsUserModalOpen(false)}
        >
          Cancel
        </Button>
        <Button
          className="ml-3 bg-indigo-500 hover:bg-indigo-900 text-white"
          onClick={handleInitUser}
        >
          Save
        </Button>
      </div>
    </DialogPanel>
  </Dialog>
</Transition>
      <Footer />
    </div>
  );
}