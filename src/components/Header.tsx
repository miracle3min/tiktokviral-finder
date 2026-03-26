'use client';

import { Flame, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="clay-section mb-8">
      <div className="flex items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-clay-400 to-pink-400 shadow-clay-sm flex items-center justify-center">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight flex items-center gap-2">
            TikTok Viral Finder
            <Sparkles className="w-5 h-5 text-clay-400" />
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Discover trending content with viral score analysis
          </p>
        </div>
      </div>
    </header>
  );
}
