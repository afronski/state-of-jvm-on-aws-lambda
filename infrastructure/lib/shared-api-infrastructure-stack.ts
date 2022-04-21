import { CfnOutput, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";

import { LambdaInfrastructureStack } from "./lambda-infrastructure-stack";
import { SharedAPIInfrastructureStackProps } from "./props/shared-api-infrastructure-stack-props";

export class SharedAPIInfrastructureStack extends Stack {
  public readonly sharedAPI: RestApi;

  constructor(scope: Construct, id: string, props: SharedAPIInfrastructureStackProps) {
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
      artifactPath: "../sources/11-java-8/build/distributions/ip-checker-1.0.0.zip",

      sharedAPI: this.sharedAPI
    });

    new LambdaInfrastructureStack(this, "Function-Java-11", {
      functionName: "ip-checker-java-11",

      runtime: Runtime.JAVA_11,
      memorySize: 256,

      handler: "ipchecker.App",
      artifactPath: "../sources/12-java-11/build/distributions/ip-checker-1.0.0.zip",

      sharedAPI: this.sharedAPI
    });

    new LambdaInfrastructureStack(this, "Function-Clojure", {
      functionName: "ip-checker-clj",

      runtime: Runtime.JAVA_11,
      memorySize: 256,

      handler: "ipchecker.app::handler",
      artifactPath: "../sources/13-clojure/target/ip-checker-1.0.0-standalone.jar",

      sharedAPI: this.sharedAPI
    });

    new LambdaInfrastructureStack(this, "Function-Java-11-JIT-Optimization", {
      functionName: "ip-checker-java-11-jit-opt",

      runtime: Runtime.JAVA_11,
      memorySize: 256,

      handler: "ipchecker.App",
      artifactPath: "../sources/21-java-11-jit-opt/build/distributions/ip-checker-1.0.0.zip",

      sharedAPI: this.sharedAPI,

      stopTieredCompilationAtLevel1: true
    });

    new LambdaInfrastructureStack(this, "Function-Clojure-JIT-optimization", {
      functionName: "ip-checker-clj-jit-opt",

      runtime: Runtime.JAVA_11,
      memorySize: 256,

      handler: "ipchecker.app::handler",
      artifactPath: "../sources/22-clojure-jit-opt/target/ip-checker-1.0.0-standalone.jar",

      sharedAPI: this.sharedAPI,

      stopTieredCompilationAtLevel1: true
    });

    new LambdaInfrastructureStack(this, "Function-Clojure-Custom-Runtime", {
      functionName: "ip-checker-clj-custom-runtime",

      runtime: Runtime.PROVIDED_AL2,
      memorySize: 256,

      handler: "ip-checker.core.CheckIPLambda",
      artifactPath: "../sources/23-clojure-custom-runtime/.holy-lambda/build/output.jar",

      sharedAPI: this.sharedAPI,

      holyLambdaEntrypoint: "ip-checker.core",
      babashkaRuntimeLayerARN: props.babashkaRuntimeLayerARN,
      babashkaDependenciesPath: "../sources/23-clojure-custom-runtime/.holy-lambda/bb-clj-deps"
    });
  }
}
