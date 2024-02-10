'use server';

import { db } from '@/config';
import { conversationSchema } from '@/schema';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { currentUser } from '@clerk/nextjs';

export const getOneConversation = async (uuid: string) => {
  const currentUserData = await currentUser();

  const { Item } = await db.send(
    new GetCommand({
      TableName: process.env.DB_TABLE_NAME,
      Key: {
        pk: `USER#${currentUserData?.id}`,
        sk: `CONVERSATION#${uuid}`,
      },
    })
  );

  return conversationSchema.parse(Item);
};
