'use server';

import { db } from '@/config';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { currentUser } from '@clerk/nextjs';

export const deprecateConversation = async (uuid: string) => {
  const currentUserData = await currentUser();

  try {
    await db.send(
      new UpdateCommand({
        TableName: process.env.DB_TABLE_NAME,
        Key: {
          pk: `USER#${currentUserData?.id}`,
          sk: `CONVERSATION#${uuid}`,
        },
        UpdateExpression: 'SET #status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': 'DEPRECATED',
        },
      })
    );
  } catch (error) {
    console.log(error);
    throw new Error('Failed to deprecate conversation');
  }
};
