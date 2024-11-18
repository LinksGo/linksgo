'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900">
            Welcome to <span className="gradient-text">LinksGo</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Share your important links with the world
          </p>
        </div>
        
        <div className="mt-8">
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 
                     rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 
                     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-primary-500 transition-colors duration-200"
          >
            <Image
              src="/google.svg"
              alt="Google Logo"
              width={20}
              height={20}
              className="mr-2"
            />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}
