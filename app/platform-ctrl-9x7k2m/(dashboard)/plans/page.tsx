"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Check, Zap, Building2 } from "lucide-react";

const plans = [
  {
    name: "Launch",
    price: "₹4,999",
    period: "/month",
    description: "Perfect for small clinics getting started",
    features: [
      "Up to 5 staff members",
      "Basic appointment management",
      "Patient records",
      "Email support",
    ],
    tenants: 12,
  },
  {
    name: "Growth",
    price: "₹14,999",
    period: "/month",
    description: "For growing hospitals with multiple departments",
    features: [
      "Up to 25 staff members",
      "Advanced scheduling",
      "Billing & invoicing",
      "Telehealth integration",
      "Priority support",
    ],
    tenants: 28,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large healthcare networks",
    features: [
      "Unlimited staff",
      "Multi-location support",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantees",
      "On-premise option",
    ],
    tenants: 5,
  },
];

export default function SecurePlansPage() {
  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Subscription Management
        </p>
        <h2 className="text-3xl font-semibold">Pricing Plans</h2>
        <p className="text-white/70">
          Manage subscription tiers and tenant plan assignments.
        </p>
      </header>

      {/* Plan Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`bg-white/5 border-white/10 relative ${
              plan.popular ? "ring-2 ring-healthcare-primary" : ""
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-healthcare-primary text-white border-0">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{plan.name}</span>
                <Badge className="bg-white/10 text-white/80 border-0">
                  <Building2 className="h-3 w-3 mr-1" />
                  {plan.tenants} tenants
                </Badge>
              </CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-white/60">{plan.period}</span>
              </div>
              <p className="text-sm text-white/60 mt-2">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-sm text-white/60">Monthly Recurring</p>
              <p className="text-2xl font-bold text-emerald-200">₹4,79,972</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-sm text-white/60">Annual Projection</p>
              <p className="text-2xl font-bold text-blue-200">₹57,59,664</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-sm text-white/60">Avg. Revenue/Tenant</p>
              <p className="text-2xl font-bold text-purple-200">₹10,666</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Features */}
      <Card className="bg-gradient-to-r from-healthcare-primary/20 to-slate-900/50 border-healthcare-primary/30">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-healthcare-primary/30">
              <Zap className="h-6 w-6 text-healthcare-primary" />
            </div>
            <div>
              <p className="font-medium">Plan Management Coming Soon</p>
              <p className="text-sm text-white/60">
                Self-service plan upgrades, usage-based billing, and automated invoicing are in development.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
