'use client'

import {
  Dialog,
  DialogPanel
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useState } from 'react'
import logo from '../../../../public/sol-logo.png'



export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-indigo-700">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex flex-1 text-white">
          <a href="#" className="flex -m-1 p-1.9">
            <Image
                alt=""
                src={logo}
                className="h-10 w-auto"
              />
          </a>
          <h2 className="flex lg:ml-10 border-l-8 border-indigo-700 text-2xl font-bold">
                <div className="bg-clip-text bg-gradient-to-br from-indigo-300 colorpink"
                >
                   BLOGSOL
                </div>
              </h2>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 "
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button className="rounded-lg flex justify-center items-center py-2 px-4 bg-transparent hover:bg-indigo-900 text- bg-indigo-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
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
           Connect your Wallet
          </button>
  
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-indigo-600 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <Image
                alt=""
                src={logo}
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">

              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3  flex justify-center items-center block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-indigo-900"
                >
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
                  Connect your Wallet
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}