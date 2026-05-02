// components/PageLoader.tsx

import React from 'react';

const PageLoader: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 w-12 h-12 border-4 border-gray-200 border-solid rounded-full"></div>
      <div className="absolute inset-0 w-12 h-12 border-4 border-emerald-600 border-solid rounded-full border-t-transparent animate-spin"></div>
    </div>
  </div>
);

export default PageLoader;