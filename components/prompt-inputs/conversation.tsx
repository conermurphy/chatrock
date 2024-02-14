'use client';

import { updateConversation } from '@/app/actions/db/update-conversation';
import { GenericPromptInput } from './generic';
import { PromptFormInputs } from '@/types';
import { useConversation } from '@/context/conversation-context';

interface IProps {
  uuid: string;
}

export function ConversationPromptInput({ uuid }: IProps) {
  const { setConversation, isGenerating } = useConversation();

  // onSubmit handler to update the conversation in the DB with the user's new prompt and update the data in context
  const onSubmitHandler = async (data: PromptFormInputs) => {
    const updatedConversation = await updateConversation(uuid, data.prompt);

    setConversation(updatedConversation);
  };

  return (
    <GenericPromptInput
      onSubmitHandler={onSubmitHandler}
      isGenerating={isGenerating}
    />
  );
}
