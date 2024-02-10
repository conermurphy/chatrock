'use client';

import { updateConversation } from '@/app/actions/db/update-conversation';
import { GenericPromptInput } from './generic';
import { PromptFormInputs } from '@/types';
import { useConversation } from '@/context/conversation-context';

interface IProps {
  uuid: string;
  isGenerating?: boolean;
}

export function ConversationPromptInput({ uuid, isGenerating }: IProps) {
  const { setConversation } = useConversation();

  const onSubmitHandler = async (data: PromptFormInputs) => {
    const updatedConversation = await updateConversation(uuid, data.prompt);

    setConversation(updatedConversation);
  };

  return (
    <GenericPromptInput
      onSubmitHandler={onSubmitHandler}
      isGenerating={isGenerating}
      uuid={uuid}
    />
  );
}
