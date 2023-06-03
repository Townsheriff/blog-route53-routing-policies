import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

export type WeightedRoutingProps = {
  domainName: string;
  zone: cdk.aws_route53.IHostedZone;
};

export class WeightedRouting extends Construct {
  constructor(scope: Construct, id: string, props: WeightedRoutingProps) {
    super(scope, id);

    const firstRecord = new cdk.aws_route53.ARecord(
      this,
      "FirstWeightedRoutingRecord",
      {
        zone: props.zone,
        recordName: props.domainName,
        target: cdk.aws_route53.RecordTarget.fromValues("111.111.111.111"),
      }
    );

    const firstNode = firstRecord.node
      .defaultChild as cdk.aws_route53.CfnRecordSet;
    firstNode.weight = 1;
    firstNode.setIdentifier = "FirstGeoLocationRouting";

    const secondRecord = new cdk.aws_route53.ARecord(
      this,
      "SecondWeightedRoutingRecord",
      {
        zone: props.zone,
        recordName: props.domainName,
        target: cdk.aws_route53.RecordTarget.fromValues("222.222.222.222"),
      }
    );

    const secondNode = secondRecord.node
      .defaultChild as cdk.aws_route53.CfnRecordSet;
    secondNode.weight = 1;
    secondNode.setIdentifier = "SecondGeoLocationRouting";
  }
}
