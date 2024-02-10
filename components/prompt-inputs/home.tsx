'use client';

import { createConversation } from '@/app/actions/db/create-conversation';
import { GenericPromptInput } from './generic';
import { PromptFormInputs } from '@/types';
import { useRouter } from 'next/navigation';

export function HomePromptInput() {
  const router = useRouter();

  const onSubmitHandler = async (data: PromptFormInputs) => {
    const { uuid } = await createConversation(data.prompt);

    router.push(`/${uuid}`);
  };

  return <GenericPromptInput onSubmitHandler={onSubmitHandler} />;
}
