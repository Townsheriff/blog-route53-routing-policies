import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

export type MultiValueAnswerRoutingProps = {
  domainName: string;
  zone: cdk.aws_route53.IHostedZone;
};

export class MultiValueAnswerRouting extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: MultiValueAnswerRoutingProps
  ) {
    super(scope, id);

    const firstRecord = new cdk.aws_route53.ARecord(
      this,
      "FirstMultiValueRoutingRecord",
      {
        zone: props.zone,
        recordName: props.domainName,
        target: cdk.aws_route53.RecordTarget.fromIpAddresses("111.111.111.111"),
      }
    );

    const firstNode = firstRecord.node
      .defaultChild as cdk.aws_route53.CfnRecordSet;

    firstNode.setIdentifier = "FirstMultiValueRouting";
    firstNode.multiValueAnswer = true;

    const secondRecord = new cdk.aws_route53.ARecord(
      this,
      "SecondMultiValueRoutingRecord",
      {
        zone: props.zone,
        recordName: props.domainName,
        target: cdk.aws_route53.RecordTarget.fromIpAddresses("222.222.222.222"),
      }
    );

    const secondNode = secondRecord.node
      .defaultChild as cdk.aws_route53.CfnRecordSet;

    secondNode.setIdentifier = "SecondMultiValueRouting";
    secondNode.multiValueAnswer = true;
  }
}
