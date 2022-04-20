import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";

import { LambdaInfrastructureStack } from "./lambda-infrastructure-stack";

export class SharedAPIInfrastructureStack extends Stack {
  public readonly sharedAPI: RestApi;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // Shared Amazon API Gateway for the deployed AWS Lambda entry points.

    this.sharedAPI = new RestApi(this, "SharedAPI", {
      restApiName: "state-of-jvm-on-aws-lambda-api",
      description: "Shared Amazon API Gateway for the talk 'The State of JVM on AWS Lambda'.",

      deployOptions: {
        stageName: "prod"
      },

      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key"
        ],
        allowMethods: [ "OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE" ],
        allowCredentials: true,
        allowOrigins: [ "*" ]
      }
    });

    new CfnOutput(this, "URLForSharedAPI", {
      value: this.sharedAPI.url
    });

    // Implementation of the handlers as AWS Lambda functions.

    new LambdaInfrastructureStack(this, "Function-Java-8", {
      functionName: "ip-checker-java-8",

      runtime: Runtime.JAVA_8,
      memorySize: 256,

      handler: "ipchecker.App",
      artifactPath: "../sources/01-java-8/build/distributions/ip-checker-1.0.0.zip",

      sharedAPI: this.sharedAPI
    });

    new LambdaInfrastructureStack(this, "Function-Java-11", {
      functionName: "ip-checker-java-11",

      runtime: Runtime.JAVA_11,
      memorySize: 256,

      handler: "ipchecker.App",
      artifactPath: "../sources/02-java-11/build/distributions/ip-checker-1.0.0.zip",

      sharedAPI: this.sharedAPI
    });

  }
}
