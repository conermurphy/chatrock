#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ChatRockIntfrastructureStack } from '../lib/chatrock-infrastructure-stack';

const app = new cdk.App();
new ChatRockIntfrastructureStack(app, 'ChatRockIntfrastructureStack', {});
