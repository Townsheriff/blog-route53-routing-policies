import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

export type FailoverRoutingProps = {
  zone: cdk.aws_route53.IHostedZone;
  domainName: string;
  invertedHealthCheck: boolean;
};

export class FailoverRouting extends Construct {
  constructor(scope: Construct, id: string, props: FailoverRoutingProps) {
    super(scope, id);

    const healthCheck = new cdk.aws_route53.CfnHealthCheck(
      this,
      "HealthCheck",
      {
        healthCheckConfig: {
          type: "HTTPS",
          // should be target endpoint
          fullyQualifiedDomainName: props.domainName,
          inverted: props.invertedHealthCheck,
          resourcePath: "/health",
        },
        healthCheckTags: [
          {
            key: "Name",
            value: `HealthCheck-PrimaryFailoverRouting`,
          },
        ],
      }
    );

    const primaryRecord = new cdk.aws_route53.ARecord(
      this,
      "PrimaryFailoverRoutingRecord",
      {
        zone: props.zone,
        recordName: props.domainName,
        target: cdk.aws_route53.RecordTarget.fromValues("111.111.111.111"),
      }
    );

    const primaryNode = primaryRecord.node
      .defaultChild as cdk.aws_route53.CfnRecordSet;
    primaryNode.failover = "PRIMARY";
    primaryNode.setIdentifier = "PrimaryFailoverRouting";

    primaryNode.healthCheckId = healthCheck.attrHealthCheckId;

    const secondaryRecord = new cdk.aws_route53.ARecord(
      this,
      "SecondaryFailoverRoutingRecord",
      {
        zone: props.zone,
        recordName: props.domainName,
        target: cdk.aws_route53.RecordTarget.fromValues("222.222.222.222"),
      }
    );

    const secondaryNode = secondaryRecord.node
      .defaultChild as cdk.aws_route53.CfnRecordSet;
    secondaryNode.failover = "SECONDARY";
    secondaryNode.setIdentifier = "SecondaryFailoverRouting";
  }
}
