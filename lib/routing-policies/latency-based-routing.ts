import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

export type LatencyBasedRoutingProps = {
  zone: cdk.aws_route53.IHostedZone;
  domainName: string;
};

export class LatencyBasedRouting extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: LatencyBasedRoutingProps
  ) {
    super(scope, id);

    const europeRecord = new cdk.aws_route53.ARecord(
      this,
      "EuropeLatencyBasedRoutingRecord",
      {
        zone: props.zone,
        recordName: props.domainName,
        target: cdk.aws_route53.RecordTarget.fromValues("111.111.111.111"),
      }
    );

    const europeRecordNode = europeRecord.node
      .defaultChild as cdk.aws_route53.CfnRecordSet;

    europeRecordNode.region = "eu-central-1";
    europeRecordNode.setIdentifier = "EuropeLatencyBasedRouting";

    const usEastRecord = new cdk.aws_route53.ARecord(
      this,
      "UsEastLatencyBasedRoutingRecord",
      {
        zone: props.zone,
        recordName: props.domainName,
        target: cdk.aws_route53.RecordTarget.fromValues("222.222.222.222"),
      }
    );

    const usEastRecordNode = usEastRecord.node
      .defaultChild as cdk.aws_route53.CfnRecordSet;

    usEastRecordNode.region = "us-east-1";
    usEastRecordNode.setIdentifier = "UsEastLatencyBasedRouting";
  }
}
