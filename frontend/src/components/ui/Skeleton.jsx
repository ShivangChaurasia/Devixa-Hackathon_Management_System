import React from 'react';

export function Skeleton({ className = '', variant = 'rectangular' }) {
  const baseClasses = 'relative overflow-hidden bg-foreground/10 rounded-2xl';
  
  return (
    <div className={`${baseClasses} ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="p-6 md:p-8 rounded-[24px] bg-card border border-border/80 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-md" />
      </div>
      <Skeleton className="h-7 w-3/4 rounded-lg" />
      <Skeleton className="h-4 w-1/2 rounded-md" />
      <div className="pt-4 border-t border-border/50 flex justify-between">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-md" />
      </div>
    </div>
  );
}

export function SkeletonCockpit() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <Skeleton className="h-12 w-44 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
