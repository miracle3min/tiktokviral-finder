'use client';

export default function LoadingDots({ text = 'Searching' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-1 text-clay-500 font-medium">
      <span>{text}</span>
      <span className="dot-animation flex gap-0.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay-400" />
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay-400" />
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay-400" />
      </span>
    </div>
  );
}
