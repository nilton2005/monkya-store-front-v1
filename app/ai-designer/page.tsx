'use client';

import dynamic from 'next/dynamic';

const AIDesignEditor = dynamic(() => import('../../components/ai-design/ai-editor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Cargando diseñador...</p>
      </div>
    </div>
  ),
});

export default function AIDesignerPage() {
  return (
    <div className="h-screen w-full">
      <AIDesignEditor />
    </div>
  );
}
