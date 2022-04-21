import { NestedStackProps } from "aws-cdk-lib";

import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export interface LambdaInfrastructureStackProps extends NestedStackProps {
  functionName: string;

  runtime: Runtime;

  memorySize: number;

  handler: string;
  artifactPath: string;

  sharedAPI: RestApi;

  stopTieredCompilation?: boolean;
}
