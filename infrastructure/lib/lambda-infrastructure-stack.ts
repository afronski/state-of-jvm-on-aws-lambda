import { Duration, NestedStack } from "aws-cdk-lib";
import { Construct } from "constructs";

import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Code, Function, LayerVersion } from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

import { LambdaInfrastructureStackProps } from "./props/lambda-infrastructure-stack-props";

export class LambdaInfrastructureStack extends NestedStack {

  constructor(scope: Construct, id: string, props: LambdaInfrastructureStackProps) {
    super(scope, id, props);

    const variables: { [key: string]: string } = {};

    if (props.stopTieredCompilationAtLevel1) {
      variables["JAVA_TOOL_OPTIONS"] = "-XX:+TieredCompilation -XX:TieredStopAtLevel=1";
    }

    if (props.holyLambdaEntrypoint) {
      variables["HL_ENTRYPOINT"] = props.holyLambdaEntrypoint;
    }

    const layers = [];

    if (props.babashkaRuntimeLayerARN && props.babashkaDependenciesPath) {
      layers.push(LayerVersion.fromLayerVersionArn(this, "BabashkaRuntimeLayer", props.babashkaRuntimeLayerARN));
      layers.push(
        new LayerVersion(this, "BabashkaDepsLayer", {
          code: Code.fromAsset(props.babashkaDependenciesPath)
        })
      );
    }

    const implementation = new Function(this, "LambdaFunction", {
      functionName: props.functionName,

      runtime: props.runtime,

      handler: props.handler,
      code: Code.fromAsset(props.artifactPath),

      memorySize: props.memorySize,

      timeout: Duration.seconds(25),
      logRetention: RetentionDays.FIVE_DAYS,

      environment: variables,
      layers: layers
    });

    // Amazon API Gateway resource and method.

    const resource = props.sharedAPI.root.addResource(props.functionName);
    resource.addMethod("GET", new LambdaIntegration(implementation, { proxy: true }));
  }
}
