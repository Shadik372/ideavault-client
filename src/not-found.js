import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-8xl font-bold text-violet-600">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Page Not Found</h2>
      <p className="text-gray-500">The page you are looking for does not exist.</p>
      <Link href="/" className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
        Go Home
      </Link>
    </div>
  );
}