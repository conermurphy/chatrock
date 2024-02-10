import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const awsConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_KEY_VALUE || '',
  },
  region: process.env.AWS_API_REGION || '',
};

export const db = DynamoDBDocument.from(new DynamoDB(awsConfig), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: false,
  },
});

export const bedrock = new BedrockRuntimeClient({
  ...awsConfig,
  region: 'us-east-1',
});
