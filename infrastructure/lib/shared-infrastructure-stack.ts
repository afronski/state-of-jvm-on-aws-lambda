import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import { Repository } from "aws-cdk-lib/aws-codecommit";

export class SharedInfrastructureStack extends Stack {
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
  }
}
