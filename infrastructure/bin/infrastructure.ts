#!/usr/bin/env node

import "source-map-support/register";

import * as cdk from "aws-cdk-lib";

import { InstanceClass, InstanceSize, InstanceType } from "aws-cdk-lib/aws-ec2";

import { IDEInfrastructureStack } from "../lib/ide-infrastructure-stack";
import { SharedInfrastructureStack } from "../lib/shared-infrastructure-stack";
import { SharedAPIInfrastructureStack } from "../lib/shared-api-infrastructure-stack";

const account = process.env.AWS_ACCOUNT_ID || process.env.CDK_DEFAULT_ACCOUNT || null;
const region = process.env.AWS_REGION || process.env.CDK_DEFAULT_REGION || null;

const userName = process.env.AWS_USERNAME || null;

const babashkaRuntimeLayerARN = process.env.BABASHKA_RUNTIME_LAYER_ARN || null;

if (!account) {
  throw new Error("Environment variable `AWS_ACCOUNT_ID` or `CDK_DEFAULT_ACCOUNT` is required.");
}

if (!region) {
  throw new Error("Environment variable `AWS_REGION` or `CDK_DEFAULT_REGION` is required.");
}

if (!userName) {
  throw new Error("Environment variable `AWS_USERNAME` is required.");
}

if (!babashkaRuntimeLayerARN) {
  throw new Error("Environment variable `BABASHKA_RUNTIME_LAYER_ARN` is required.");
}

const SHARED_ENVIRONMENT_SETTINGS = {
  env: { account, region }
};

const app = new cdk.App();

const sharedInfrastructureStack = new SharedInfrastructureStack(app, "Infrastructure-Shared", {
  ...SHARED_ENVIRONMENT_SETTINGS
});

new IDEInfrastructureStack(app, "Infrastructure-IDE", {
  ...SHARED_ENVIRONMENT_SETTINGS,

  userName,

  repositoryCloneUrlHttp: sharedInfrastructureStack.repositoryCloneUrlHttp,

  instanceTypeIDE: InstanceType.of(InstanceClass.M5, InstanceSize.LARGE)
});

new SharedAPIInfrastructureStack(app, "Infrastructure-API", {
  ...SHARED_ENVIRONMENT_SETTINGS,

  babashkaRuntimeLayerARN
});
