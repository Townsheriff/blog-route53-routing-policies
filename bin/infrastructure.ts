#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { RoutingPolicyStack } from "../lib/routing-policy-stack";

const app = new cdk.App();

new RoutingPolicyStack(app, "RoutingPolicyStack", {});
