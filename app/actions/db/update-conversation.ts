'use server';

import { db } from '@/config';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { currentUser } from '@clerk/nextjs';
import { getOneConversation } from './get-one-conversation';
import { conversationSchema } from '@/schema';

export const updateConversation = async (uuid: string, prompt: string) => {
  const currentUserData = await currentUser();

  if (!currentUserData) {
    throw new Error('User not found');
  }

  const { conversation } = await getOneConversation(uuid);

  try {
    const { Attributes } = await db.send(
      new UpdateCommand({
        TableName: process.env.DB_TABLE_NAME,
        Key: {
          pk: `USER#${currentUserData?.id}`,
          sk: `CONVERSATION#${uuid}`,
        },
        UpdateExpression: 'set conversation = :c',
        ExpressionAttributeValues: {
          ':c': [
            ...conversation,
            {
              author: `USER#${currentUserData?.id}`,
              content: prompt,
            },
          ],
        },
        ReturnValues: 'ALL_NEW',
      })
    );

    return conversationSchema.parse(Attributes);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update conversation');
  }
};
