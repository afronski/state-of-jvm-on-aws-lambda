import { StackProps } from "aws-cdk-lib";

export interface SharedAPIInfrastructureStackProps extends StackProps {
  babashkaRuntimeLayerARN: string;
}
