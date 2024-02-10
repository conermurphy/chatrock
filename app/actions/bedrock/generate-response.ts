'use server';

import { bedrock, db } from '@/config';
import { getOneConversation } from '../db/get-one-conversation';
import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { bedrockResponseSchema, conversationSchema } from '@/schema';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { currentUser } from '@clerk/nextjs';

export const generateResponse = async (uuid: string) => {
  const currentUserData = await currentUser();
  const { conversation } = await getOneConversation(uuid);

  const prompt = conversation
    .map(({ author, content }) => {
      if (author === 'ai') {
        return `${content}`;
      } else {
        return `[INST]${content}[/INST]`;
      }
    })
    .join('');

  const input = {
    accept: 'application/json',
    contentType: 'application/json',
    modelId: 'meta.llama2-70b-chat-v1',
    body: JSON.stringify({
      prompt,
      max_gen_len: 512,
      temperature: 0.5,
      top_p: 0.9,
    }),
  };

  const bedrockResponse = await bedrock.send(new InvokeModelCommand(input));

  const { generation } = bedrockResponseSchema.parse(
    JSON.parse(new TextDecoder().decode(bedrockResponse.body))
  );

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
            author: 'ai',
            content: generation,
          },
        ],
      },
      ReturnValues: 'ALL_NEW',
    })
  );

  return conversationSchema.parse(Attributes);
};
