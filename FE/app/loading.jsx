import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-10 animate-pulse w-full max-w-7xl mx-auto py-4">
      {/* 1. Skeleton Hero Banner */}
      <div className="w-full h-64 sm:h-96 md:h-[420px] rounded-3xl bg-slate-200/80 dark:bg-slate-800/60 relative overflow-hidden flex flex-col justify-end p-6 sm:p-10 space-y-4">
        <div className="h-4 w-28 bg-slate-300 dark:bg-slate-700 rounded-full" />
        <div className="h-8 sm:h-12 w-3/4 max-w-xl bg-slate-300 dark:bg-slate-700 rounded-2xl" />
        <div className="h-4 w-1/2 max-w-md bg-slate-300 dark:bg-slate-700 rounded-lg" />
        <div className="flex gap-3 pt-2">
          <div className="h-10 w-32 bg-slate-300 dark:bg-slate-700 rounded-xl" />
          <div className="h-10 w-28 bg-slate-300 dark:bg-slate-700 rounded-xl" />
        </div>
      </div>

      {/* 2. Skeleton Quick Filter Pills */}
      <div className="flex items-center gap-3 overflow-hidden pb-1">
        {[100, 140, 120, 160, 110, 130].map((width, idx) => (
          <div
            key={idx}
            style={{ width: `${width}px` }}
            className="h-9 shrink-0 bg-slate-200 dark:bg-slate-800 rounded-2xl"
          />
        ))}
      </div>

      {/* 3. Skeleton Product Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="rounded-3xl p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3"
            >
              {/* Product Image Skeleton */}
              <div className="w-full h-44 rounded-2xl bg-slate-100 dark:bg-slate-800/80" />
              {/* Brand & Badge */}
              <div className="flex items-center justify-between">
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
              {/* Title */}
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
              {/* Specs tags */}
              <div className="flex gap-1.5 pt-1">
                <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded-md" />
                <div className="h-5 w-20 bg-slate-100 dark:bg-slate-800 rounded-md" />
              </div>
              {/* Price & Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <div className="h-6 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
