import * as cdk from '@aws-cdk/core';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import * as path from 'path';
import * as ecs from '@aws-cdk/aws-ecs'; 
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const asset = new DockerImageAsset(this, "SuperMarioAsset", {
      directory: path.resolve(__dirname, ".."),
      exclude: ["cdk", "cdk.out"],
      repositoryName: "super-mario-image-repo"
    });

    const cluster = new ecs.Cluster(this, "Cluster", { 
      clusterName: "SuperMarioCluster",
    });

    new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      "SuperMarioFargate",
      {
        cluster,
        memoryLimitMiB: 512,
        desiredCount: 1,
        serviceName: "super-mario-app",
        taskImageOptions: {
          image: ecs.ContainerImage.fromDockerImageAsset(asset),
          containerPort: 8080,
        },
        publicLoadBalancer: true,
      }
    );
  }
}
