'use server';

import { db } from '@/config';
import { conversationSchema } from '@/schema';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { currentUser } from '@clerk/nextjs';

export const getAllConversations = async (includeDeprecated = false) => {
  const currentUserData = await currentUser();

  try {
    // Get the first 100 conversations for the current user from the DB
    const { Items } = await db.send(
      new QueryCommand({
        TableName: process.env.DB_TABLE_NAME,
        ExpressionAttributeValues: {
          ':pk': `USER#${currentUserData?.id}`,
          ':sk': 'CONVERSATION#',
        },
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
        Limit: 100,
      })
    );

    const parsedPrompts = conversationSchema.array().nullish().parse(Items);

    // If the request wants to return deprecated ones, return all data
    if (includeDeprecated) {
      return parsedPrompts;
    }

    // Otherwise filter for just active ones and return them
    return parsedPrompts?.filter((prompt) => prompt.status === 'ACTIVE');
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch all conversations');
  }
};
