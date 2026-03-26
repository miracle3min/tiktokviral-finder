'use client';

import { useState, FormEvent } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import LoadingDots from './LoadingDots';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  isLoading: boolean;
}

const trendingSuggestions = ['cooking tips', 'life hacks', 'fitness motivation', 'OOTD', 'pet videos', 'travel vlog'];

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && !isLoading) {
      onSearch(trimmed);
    }
  };

  return (
    <div className="clay-section mb-8 space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search viral TikTok content..."
            className="clay-input pl-12 text-base"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="clay-button bg-gradient-to-r from-clay-400 to-pink-400 text-white
                     hover:from-clay-500 hover:to-pink-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2 whitespace-nowrap"
        >
          {isLoading ? (
            <LoadingDots text="Searching" />
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </>
          )}
        </button>
      </form>

      {/* Trending Suggestions */}
      <div className="flex flex-wrap gap-2">
        <TrendingUp className="w-4 h-4 text-clay-400 mt-1" />
        {trendingSuggestions.map((tag) => (
          <button
            key={tag}
            onClick={() => { setQuery(tag); onSearch(tag); }}
            disabled={isLoading}
            className="clay-badge hover:shadow-clay-hover hover:-translate-y-0.5
                       transition-all duration-200 cursor-pointer text-gray-600
                       hover:text-clay-600 disabled:opacity-50"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
