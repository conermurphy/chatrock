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

  const uuid = randomUUID();
  const conversationUuid = `CONVERSATION#${uuid}`;

  const craeteBody = {
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
    await db.send(
      new PutCommand({
        TableName: process.env.DB_TABLE_NAME,
        Item: craeteBody,
        ReturnValues: 'ALL_OLD',
      })
    );
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create conversation');
  }

  return conversationSchema.parse(craeteBody);
};
