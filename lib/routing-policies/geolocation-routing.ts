import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

export type GeoLocationRoutingProps = {
  zone: cdk.aws_route53.IHostedZone;
  domainName: string;
};

export class GeoLocationRouting extends Construct {
  constructor(scope: Construct, id: string, props: GeoLocationRoutingProps) {
    super(scope, id);

    const defaultRecord = new cdk.aws_route53.ARecord(
      this,
      "DefaultGeoLocationRoutingRecord",
      {
        zone: props.zone,
        recordName: props.domainName,
        target: cdk.aws_route53.RecordTarget.fromValues("111.111.111.111"),
      }
    );

    const defaultNode = defaultRecord.node
      .defaultChild as cdk.aws_route53.CfnRecordSet;

    defaultNode.geoLocation = {
      countryCode: "*",
    };

    defaultNode.setIdentifier = "DefaultGeoLocationRouting";

    const europeRecord = new cdk.aws_route53.ARecord(
      this,
      "EuropeGeoLocationRoutingRecord",
      {
        zone: props.zone,
        recordName: props.domainName,
        target: cdk.aws_route53.RecordTarget.fromValues("222.222.222.222"),
      }
    );

    const europeNode = europeRecord.node
      .defaultChild as cdk.aws_route53.CfnRecordSet;

    europeNode.geoLocation = {
      continentCode: "EU",
    };

    europeNode.setIdentifier = "EuropeGeoLocationRouting";
  }
}
