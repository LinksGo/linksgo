import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-8">Profile not found</p>
        <p>We couldn&apos;t find the profile you&apos;re looking for.</p>
        <Link href="/" className="text-blue-500 hover:text-blue-600">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
