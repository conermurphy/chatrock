'use server';

import { db } from '@/config';
import { conversationSchema } from '@/schema';
import { IPromptStatus } from '@/types';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { currentUser } from '@clerk/nextjs';
import { randomUUID } from 'crypto';

export const createConversation = async (prompt: string) => {
  const currentUserData = await currentUser();

  if (!currentUserData) {
    throw new Error('User not found');
  }

  // Generate a randomUUID for the new conversation this will be used for the page UUID
  const uuid = randomUUID();
  const conversationUuid = `CONVERSATION#${uuid}`;

  // Build the input for creating the new item in the DB
  const createBody = {
    pk: `USER#${currentUserData?.id}`,
    sk: conversationUuid,
    uuid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: `${prompt.slice(0, 20)}...`,
    conversation: [
      {
        author: `USER#${currentUserData?.id}`,
        content: prompt,
      },
    ],
    status: IPromptStatus.ACTIVE,
  };

  try {
    // Create the item in the DB using the prepared body
    await db.send(
      new PutCommand({
        TableName: process.env.DB_TABLE_NAME,
        Item: createBody,
        ReturnValues: 'ALL_OLD',
      })
    );

    // Return the created data to the frontend
    return conversationSchema.parse(createBody);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create conversation');
  }
};
