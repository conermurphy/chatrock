'use server';

import { db } from '@/config';
import { conversationSchema } from '@/schema';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { currentUser } from '@clerk/nextjs';

export const getOneConversation = async (uuid: string) => {
  const currentUserData = await currentUser();

  try {
    // Fetch the provided conversation UUID for the user from the DB
    const { Item } = await db.send(
      new GetCommand({
        TableName: process.env.DB_TABLE_NAME,
        Key: {
          pk: `USER#${currentUserData?.id}`,
          sk: `CONVERSATION#${uuid}`,
        },
      })
    );

    // Return the data to the frontend, passing it through Zod
    return conversationSchema.parse(Item);
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch conversation');
  }
};
