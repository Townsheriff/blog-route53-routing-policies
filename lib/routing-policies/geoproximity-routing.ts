import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

export type GeoProximityRoutingProps = {
  domainName: string;
  zone: cdk.aws_route53.IHostedZone;
};

export class GeoProximityRouting extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: GeoProximityRoutingProps
  ) {
    super(scope, id);

    const trafficPolicyDocument = {
      AWSPolicyFormatVersion: "2015-10-01",
      RecordType: "A",
      StartRule: "geoproximity-rule",
      Endpoints: {
        "aws-us-west-1-region": {
          Type: "value",
          Value: "1.1.2.2",
        },
        "london-data-center": {
          Type: "value",
          Value: "3.3.4.4",
        },
      },
      Rules: {
        "geoproximity-rule": {
          RuleType: "geoproximity",
          GeoproximityLocations: [
            {
              EndpointReference: "aws-us-west-1-region",
              Region: "aws:route53:eu-west-1",
              Bias: "10",
            },
            {
              EndpointReference: "london-data-center",
              Region: "aws:route53:eu-central-1",
              Bias: "0",
            },
          ],
        },
      },
    };

    const trafficPolicy = new cdk.custom_resources.AwsCustomResource(
      this,
      "TrafficPolicy",
      {
        onCreate: {
          service: "Route53",
          action: "createTrafficPolicy",
          parameters: {
            Name: "TrafficPolicy",
            Document: JSON.stringify(trafficPolicyDocument),
          },
          physicalResourceId:
            cdk.custom_resources.PhysicalResourceId.fromResponse(
              "TrafficPolicy.Id"
            ),
        },
        onDelete: {
          service: "Route53",
          action: "deleteTrafficPolicy",
          parameters: {
            Id: new cdk.custom_resources.PhysicalResourceIdReference(),
            Version: "1",
          },
        },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        policy: cdk.custom_resources.AwsCustomResourcePolicy.fromSdkCalls({
          resources: cdk.custom_resources.AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
      }
    );

    new cdk.custom_resources.AwsCustomResource(this, "TrafficPolicyInstance", {
      onCreate: {
        service: "Route53",
        action: "createTrafficPolicyInstance",
        parameters: {
          TrafficPolicyId:
            trafficPolicy.getResponseFieldReference("TrafficPolicy.Id"),
          TrafficPolicyVersion: "1",
          HostedZoneId: props.zone.hostedZoneId,
          Name: props.domainName,
          TTL: "60",
        },
        physicalResourceId:
          cdk.custom_resources.PhysicalResourceId.fromResponse(
            "TrafficPolicyInstance.Id"
          ),
      },
      onDelete: {
        service: "Route53",
        action: "deleteTrafficPolicyInstance",
        parameters: {
          Id: new cdk.custom_resources.PhysicalResourceIdReference(),
        },
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      policy: cdk.custom_resources.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cdk.custom_resources.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });
  }
}
