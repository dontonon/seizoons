/**
 * LoadingSpinner Component
 *
 * Displays a loading spinner while data is being fetched
 */
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Loading dashboard data...
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          This may take a moment as we analyze the community
        </p>
      </div>
    </div>
  );
}
