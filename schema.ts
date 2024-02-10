import { z } from 'zod';

const promptFormSchema = z.object({
  prompt: z
    .string()
    .min(1, { message: 'Please enter a prompt to continue...' }),
});

const conversationSchema = z.object({
  pk: z.string(),
  sk: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  title: z.string(),
  conversation: z.array(
    z.object({
      author: z.string(),
      content: z.string(),
    })
  ),
  status: z.enum(['ACTIVE', 'DEPRECATED']),
  uuid: z.string(),
});

export { promptFormSchema, conversationSchema };
