import { StackProps } from "aws-cdk-lib";

import { InstanceType } from "aws-cdk-lib/aws-ec2";

export interface IDEInfrastructureStackProps extends StackProps {
  userName: string;

  repositoryCloneUrlHttp: string;

  instanceTypeIDE?: InstanceType;
}
