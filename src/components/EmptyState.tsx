'use client';

import { Search, Sparkles } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="clay-section max-w-lg mx-auto text-center space-y-4 py-12">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-clay-100 to-pink-100 shadow-clay-sm
                      flex items-center justify-center animate-pulse-soft">
        <Search className="w-10 h-10 text-clay-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-700">Discover Viral Content</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto">
        Search any keyword to find the most viral TikTok videos.
        Each result comes with a <Sparkles className="inline w-3.5 h-3.5 text-clay-400" /> Viral Score.
      </p>
    </div>
  );
}
