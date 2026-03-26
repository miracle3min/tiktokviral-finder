'use client';

import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import VideoGrid from '@/components/VideoGrid';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { useSearch } from '@/hooks/useSearch';

export default function HomePage() {
  const {
    sortedVideos,
    scores,
    keyword,
    isLoading,
    error,
    sortBy,
    setSortBy,
    search,
    retry,
  } = useSearch();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <Header />
      <SearchBar onSearch={search} isLoading={isLoading} />

      {/* Content states */}
      {isLoading && <LoadingSkeleton />}

      {error && !isLoading && (
        <ErrorState message={error} onRetry={retry} />
      )}

      {!isLoading && !error && sortedVideos.length > 0 && (
        <VideoGrid
          videos={sortedVideos}
          scores={scores}
          sortBy={sortBy}
          onSortChange={setSortBy}
          keyword={keyword}
        />
      )}

      {!isLoading && !error && sortedVideos.length === 0 && !keyword && (
        <EmptyState />
      )}

      {!isLoading && !error && sortedVideos.length === 0 && keyword && (
        <div className="clay-section max-w-md mx-auto text-center py-8">
          <p className="text-gray-500">No results found for &ldquo;{keyword}&rdquo;. Try a different keyword!</p>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center mt-12 mb-6 text-xs text-gray-400">
        <p>Built with ❤️ — Not affiliated with TikTok</p>
      </footer>
    </main>
  );
}
