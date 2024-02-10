'use client';

import { getOneConversation } from '../actions/db/get-one-conversation';
import { MdOutlinePersonOutline, MdOutlineComputer } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { generateResponse } from '../actions/bedrock/generate-response';
import { useConversation } from '@/context/conversation-context';
import { ConversationPromptInput } from '@/components/prompt-inputs/conversation';
import { AiOutlineLoading } from 'react-icons/ai';

interface IPageProps {
  params: {
    uuid: string;
  };
}

export default function Page({ params: { uuid } }: IPageProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { conversation, setConversation } = useConversation();

  useEffect(() => {
    async function fetchConversation() {
      const conversation = await getOneConversation(uuid);
      setConversation(conversation);
    }

    fetchConversation();
  }, []);

  useEffect(() => {
    async function generateInitialResponse() {
      if (isGenerating) return;

      setIsGenerating(true);

      const lastAuthor = conversation?.conversation.at(-1)?.author;

      if (!conversation || lastAuthor === 'ai') {
        setIsGenerating(false);
        return;
      }

      const generatedReponse = await generateResponse(uuid);

      setConversation(generatedReponse);
      setIsGenerating(false);
    }

    generateInitialResponse();
  }, [conversation]);

  return (
    <main className="relative flex h-full flex-row w-full items-center justify-center p-12 pb-0">
      <div className="h-full w-full max-w-3xl flex flex-col justify-between items-start gap-12">
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center gap-4 bg-gray-100/75 ${isGenerating ? 'opacity-100' : 'opacity-0 -z-10'}`}
        >
          <AiOutlineLoading className="animate-spin text-gray-700" size={56} />
          <p className="text-2xl font-semibold animate-pulse">Generating...</p>
        </div>

        <div className="flex flex-col items-start gap-12">
          {conversation?.conversation.map((message, ind) => (
            <div
              className="flex flex-row gap-4 items-start"
              key={`${message.content}-${ind}`}
            >
              {message.author === conversation.pk ? (
                <div className="bg-violet-400 rounded-sm p-2 text-white">
                  <MdOutlinePersonOutline size={20} />
                </div>
              ) : (
                <div className="bg-green-400 rounded-sm p-2 text-white">
                  <MdOutlineComputer />
                </div>
              )}
              <p key={message.content}>{message.content}</p>
            </div>
          ))}
        </div>
        <div className="w-full flex justify-center pb-12">
          <ConversationPromptInput isGenerating={isGenerating} uuid={uuid} />
        </div>
      </div>
    </main>
  );
}
