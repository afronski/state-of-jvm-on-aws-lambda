#!/usr/bin/env node

import "source-map-support/register";

import * as cdk from "aws-cdk-lib";

import { InstanceClass, InstanceSize, InstanceType } from "aws-cdk-lib/aws-ec2";
import { Runtime } from "aws-cdk-lib/aws-lambda";

import { IDEInfrastructureStack } from "../lib/ide-infrastructure-stack";
import { SharedInfrastructureStack } from "../lib/shared-infrastructure-stack";
import { LambdaInfrastructureStack } from "../lib/lambda-infrastructure-stack";

const account = process.env.AWS_ACCOUNT_ID || process.env.CDK_DEFAULT_ACCOUNT || null;
const region = process.env.AWS_REGION || process.env.CDK_DEFAULT_REGION || null;

const userName = process.env.AWS_USERNAME || null;

if (!account) {
  throw new Error("Environment variable `AWS_ACCOUNT_ID` or `CDK_DEFAULT_ACCOUNT` is required.");
}

if (!region) {
  throw new Error("Environment variable `AWS_REGION` or `CDK_DEFAULT_REGION` is required.");
}

if (!userName) {
  throw new Error("Environment variable `AWS_USERNAME` is required.");
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

new LambdaInfrastructureStack(app, "Function-Java-8", {
  functionName: "ip-checker-java-8",

  runtime: Runtime.JAVA_8,
  memorySize: 256,

  handler: "ipchecker.App",
  artifactPath: "../sources/01-java-8/build/distributions/ip-checker-1.0.0.zip",

  sharedAPI: sharedInfrastructureStack.sharedAPI
});

new LambdaInfrastructureStack(app, "Function-Java-11", {
  functionName: "ip-checker-java-11",

  runtime: Runtime.JAVA_11,
  memorySize: 256,

  handler: "ipchecker.App",
  artifactPath: "../sources/02-java-11/build/distributions/ip-checker-1.0.0.zip",

  sharedAPI: sharedInfrastructureStack.sharedAPI
});