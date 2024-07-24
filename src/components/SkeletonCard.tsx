// components/SkeletonCard.tsx
import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="w-[17rem] h-[22rem] border rounded m-4 shadow-md animate-pulse">
      <div className="flex flex-col h-full p-2">
        <div className="h-6 bg-gray-300 rounded mb-4"></div>
        <div className="h-16 bg-gray-300 rounded mb-4"></div>
        <div className="h-20 bg-gray-300 rounded mb-4"></div>
        <div className="h-6 bg-gray-300 rounded mb-4"></div>
        <div className="flex justify-between p-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
