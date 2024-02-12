'use client';

import { generateResponse } from '@/app/actions/bedrock/generate-response';
import { getOneConversation } from '@/app/actions/db/get-one-conversation';
import { useConversation } from '@/context/conversation-context';
import { useEffect } from 'react';
import { MdOutlineComputer, MdOutlinePersonOutline } from 'react-icons/md';

interface IProps {
  uuid: string;
}

export function ConversationDisplay({ uuid }: IProps) {
  const { conversation, setConversation, isGenerating, setIsGenerating } =
    useConversation();

  useEffect(() => {
    async function fetchConversation() {
      const conversation = await getOneConversation(uuid);
      setConversation(conversation);
    }

    fetchConversation();
  }, []);

  useEffect(() => {
    async function generateAIResponse() {
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

    generateAIResponse();
  }, [conversation]);

  return (
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
  );
}
