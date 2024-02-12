'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { promptFormSchema } from '@/schema';
import { PromptFormInputs } from '@/types';

interface IProps {
  isGenerating?: boolean;
  onSubmitHandler: (data: PromptFormInputs) => Promise<void>;
}

export function GenericPromptInput({
  isGenerating = false,
  onSubmitHandler,
}: IProps) {
  // Create a new useForm instance from react-hook-form to handle our form's state
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PromptFormInputs>({
    // Pass the form's values using our Zod schema to ensure the inputs pass validation
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      prompt: '',
    },
  });

  return (
    <div className="flex flex-col gap-1 w-full items-center max-w-xl">
      <form
        className="flex w-full space-x-2"
        onSubmit={handleSubmit((data) => {
          // Run the onSubmitHandler passed into the component and then reset the form after submission
          onSubmitHandler(data);
          reset();
        })}
      >
        <Input
          type="text"
          placeholder="What would you like to ask?"
          disabled={isGenerating}
          {...register('prompt', { required: true })}
        />
        <Button type="submit" disabled={isGenerating}>
          Submit
        </Button>
      </form>
      {errors.prompt?.message && (
        <p className="text-sm text-red-600 self-start">
          {errors.prompt?.message}
        </p>
      )}
    </div>
  );
}
