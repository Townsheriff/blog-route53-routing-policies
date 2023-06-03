import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

export type IpBasedRoutingProps = {
  domainName: string;
  zone: cdk.aws_route53.IHostedZone;
};

export class IpBasedRouting extends Construct {
  constructor(scope: Construct, id: string, props: IpBasedRoutingProps) {
    super(scope, id);

    const cidrCollection = new CidrCollection(this, "CidrCollection", {
      name: "IpBasedCidrCollection",
      locations: [
        {
          locationName: "FrankfurtVPN",
          cidrList: ["123.123.123.0/24"],
        },
      ],
    });

    const defaultRecord = new cdk.aws_route53.ARecord(
      this,
      "DefaultIpBasedRoutingRecord",
      {
        zone: props.zone,
        recordName: props.domainName,
        target: cdk.aws_route53.RecordTarget.fromValues("111.111.111.111"),
      }
    );

    const defaultNode = defaultRecord.node
      .defaultChild as cdk.aws_route53.CfnRecordSet;

    defaultNode.cidrRoutingConfig = {
      collectionId: cidrCollection.cidrCollectionId,
      locationName: "*",
    };

    defaultNode.setIdentifier = "DefaultIpBasedRouting";

    const frankfurtRecord = new cdk.aws_route53.ARecord(
      this,
      "FrankfurtIpBasedRoutingRecord",
      {
        zone: props.zone,
        recordName: props.domainName,
        target: cdk.aws_route53.RecordTarget.fromValues("222.222.222.222"),
      }
    );

    const frankfurtNode = frankfurtRecord.node
      .defaultChild as cdk.aws_route53.CfnRecordSet;

    frankfurtNode.cidrRoutingConfig = {
      collectionId: cidrCollection.cidrCollectionId,
      locationName: "FrankfurtVPN",
    };

    frankfurtNode.setIdentifier = "FrankfurtIpBasedRouting";
  }
}

export class CidrCollection extends Construct {
  public cidrCollectionId: string;

  constructor(
    scope: Construct,
    id: string,
    props: cdk.aws_route53.CfnCidrCollectionProps
  ) {
    super(scope, id);

    const cidrCollection = new cdk.aws_route53.CfnCidrCollection(
      this,
      "CidrCollection",
      props
    );

    this.cidrCollectionId = cidrCollection.attrId;
  }
}
