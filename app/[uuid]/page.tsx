'use client';

import { ConversationPromptInput } from '@/components/prompt-inputs/conversation';
import { ConversationDisplay } from '@/components/conversation-display';
import { GeneratingBanner } from '@/components/generating-banner';
import { ConversationProvider } from '@/context/conversation-context';

interface IPageProps {
  params: {
    uuid: string;
  };
}

export default function Page({ params: { uuid } }: IPageProps) {
  return (
    <main className="relative flex h-full flex-row w-full items-center justify-center p-12 pb-0">
      <div className="h-full w-full max-w-3xl flex flex-col justify-between items-start gap-12">
        <ConversationProvider>
          <GeneratingBanner />
          <ConversationDisplay uuid={uuid} />
          <div className="w-full flex justify-center pb-12">
            <ConversationPromptInput uuid={uuid} />
          </div>
        </ConversationProvider>
      </div>
    </main>
  );
}
