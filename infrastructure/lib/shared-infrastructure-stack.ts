import * as statement from "cdk-iam-floyd";

import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Repository } from "aws-cdk-lib/aws-codecommit";

import { RestApi } from "aws-cdk-lib/aws-apigateway";

export class SharedInfrastructureStack extends Stack {
  private readonly sharedAPI: RestApi;
  public readonly repositoryCloneUrlHttp: string;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // Adding relevant IAM roles.

    const sharedLambdaRole = new Role(this, "AWSLambdaSharedIAMRole", {
      roleName: "lambda-iam-role",
      assumedBy: new ServicePrincipal("lambda.amazonaws.com")
    });

    sharedLambdaRole.addToPolicy(
      new statement.S3()
        .allow()
        .on("arn:aws:s3:::*")
        .on("arn:aws:s3:::*/*")
        .toGetObject()
        .toListBucket()
    );

    new CfnOutput(this, "AWSLambdaSharedIAMRoleARN", {
      value: sharedLambdaRole.roleArn
    });

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
