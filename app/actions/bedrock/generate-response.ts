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

  // Build the prompt for the AI using the correct syntax
  const prompt = conversation
    .map(({ author, content }) => {
      if (author === 'ai') {
        return `${content}`;
      } else {
        // Wrap any user inputs in [INST] blocks
        return `[INST]${content}[/INST]`;
      }
    })
    .join('');

  // Prepare the input for the AI model
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

  let generation = '';

  try {
    // Invoke the Bedrock AI model with the prepared input
    const bedrockResponse = await bedrock.send(new InvokeModelCommand(input));

    // Parse the response from Bedrock to get the generated text
    const response = bedrockResponseSchema.parse(
      JSON.parse(new TextDecoder().decode(bedrockResponse.body))
    );

    generation = response.generation;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate response from Bedrock');
  }

  try {
    // Update the conversation in the database adding the updated response to the end of the conversation
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

    // Return the updated conversation to the frontend
    return conversationSchema.parse(Attributes);
  } catch (error) {
    console.log(error);
    throw new Error('Failed to update conversation');
  }
};
