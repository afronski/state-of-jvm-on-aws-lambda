import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import { Repository } from "aws-cdk-lib/aws-codecommit";

import { RestApi } from "aws-cdk-lib/aws-apigateway";

export class SharedInfrastructureStack extends Stack {
  public readonly sharedAPI: RestApi;
  public readonly repositoryCloneUrlHttp: string;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // AWS CodeCommit repository.

    const repository = new Repository(this, "CodeRepository", {
      repositoryName: "state-of-jvm-on-aws-lambda",
      description: "Source code for 'The State of JVM on AWS Lambda' talk conducted by Wojciech Gawroński (AWS Maniac)."
    });

    repository.applyRemovalPolicy(RemovalPolicy.DESTROY);

    new CfnOutput(this, "CodeRepositoryCloneUrlHTTP", {
      exportName: "CodeRepositoryCloneUrlHTTP",
      value: repository.repositoryCloneUrlHttp
    });

    this.repositoryCloneUrlHttp = repository.repositoryCloneUrlHttp;

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
  }
}
