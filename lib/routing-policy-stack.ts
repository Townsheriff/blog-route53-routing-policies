import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { LatencyBasedRouting } from "./routing-policies/latency-based-routing";
import { FailoverRouting } from "./routing-policies/failover-routing";
import { GeoLocationRouting } from "./routing-policies/geolocation-routing";
import { WeightedRouting } from "./routing-policies/weighted-routing";
import { IpBasedRouting } from "./routing-policies/ip-based-routing";
import { MultiValueAnswerRouting } from "./routing-policies/multivalue-answer-routing";
import { GeoProximityRouting } from "./routing-policies/geoproximity-routing";

export class RoutingPolicyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const hostedZoneId = new cdk.CfnParameter(this, "hostedZoneId", {
      type: "String",
    });

    const hostedZoneName = new cdk.CfnParameter(this, "hostedZoneName", {
      type: "String",
    });

    const zone = cdk.aws_route53.PublicHostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      {
        hostedZoneId: hostedZoneId.valueAsString,
        zoneName: hostedZoneName.valueAsString,
      }
    );

    new LatencyBasedRouting(this, "LatencyBasedRouting", {
      domainName: `latency-routing.${zone.zoneName}`,
      zone: zone,
    });

    new FailoverRouting(this, "FailoverRouting", {
      domainName: `failover-routing.${zone.zoneName}`,
      zone: zone,
      invertedHealthCheck: true,
    });

    new GeoLocationRouting(this, "GeoLocationRouting", {
      domainName: `geolocation-routing.${zone.zoneName}`,
      zone: zone,
    });

    new WeightedRouting(this, "WeightedRouting", {
      domainName: `weighted-routing.${zone.zoneName}`,
      zone: zone,
    });

    new IpBasedRouting(this, "IpBasedRouting", {
      domainName: `ip-based-routing.${zone.zoneName}`,
      zone: zone,
    });

    new MultiValueAnswerRouting(this, "MultiValueRouting", {
      domainName: `multivalue-routing.${zone.zoneName}`,
      zone: zone,
    });

    new GeoProximityRouting(this, "GeoProximityRouting", {
      domainName: `geoproximity-routing.${zone.zoneName}`,
      zone: zone,
    });
  }
}
