'use client';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { promptFormSchema } from '@/schema';
import { PromptFormInputs } from '@/types';
import { usePathname, useRouter } from 'next/navigation';
import { createConversation } from '@/app/actions/create-conversation';

export function MessageInput() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PromptFormInputs>({
    resolver: zodResolver(promptFormSchema),
  });
  const pathname = usePathname();
  const router = useRouter();
  const pageName = pathname === '/' ? 'home' : 'promptPage';

  const onSubmitHandlers: {
    home: (data: PromptFormInputs) => void;
    promptPage: (data: PromptFormInputs) => void;
  } = {
    home: async (data) => {
      const { uuid } = await createConversation(data.prompt);

      router.push(`/${uuid}`);
    },
    promptPage: (data) => {},
  };

  return (
    <div className="flex flex-col gap-1 w-full items-center max-w-xl">
      <form
        className="flex w-full space-x-2"
        onSubmit={handleSubmit(onSubmitHandlers[pageName])}
      >
        <Input
          type="text"
          placeholder="What would you like to ask?"
          {...register('prompt', { required: true })}
        />
        <Button type="submit">Submit</Button>
      </form>
      {errors.prompt?.message && (
        <p className="text-sm text-red-600 self-start">
          {errors.prompt?.message}
        </p>
      )}
    </div>
  );
}
