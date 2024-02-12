'use client';

import { useConversation } from '@/context/conversation-context';
import { AiOutlineLoading } from 'react-icons/ai';

export function GeneratingBanner() {
  const { isGenerating } = useConversation();

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center gap-4 bg-gray-100/75 ${isGenerating ? 'opacity-100' : 'opacity-0 -z-10'}`}
    >
      <AiOutlineLoading className="animate-spin text-gray-700" size={56} />
      <p className="text-2xl font-semibold animate-pulse">Generating...</p>
    </div>
  );
}
