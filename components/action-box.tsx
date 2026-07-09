"use client";

import React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { BookOpen, Mail, Thermometer, Archive } from "lucide-react";
import { BeerStatus } from "@/types";

interface ActionConfig {
  label: string;
  variant: "primary" | "secondary" | "outline";
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any> | "a";
  props: Record<string, any>;
}

const STATUS_STRATEGY_MAP: Record<BeerStatus, ActionConfig> = {
  on_deck: {
    label: "Read Development Notes",
    variant: "outline",
    icon: BookOpen,
    component: Link,
    props: { href: "/blog" },
  },
  brewing: {
    label: "View Active Telemetry",
    variant: "secondary",
    icon: Thermometer,
    component: Link,
    props: { href: "/#telemetry" },
  },
  ready: {
    label: "Request a Tasting Batch",
    variant: "primary",
    icon: Mail,
    component: Link,
    props: { href: "/contact" },
  },
  archived: {
    label: "Browse Batch History",
    variant: "outline",
    icon: Archive,
    component: Link,
    props: { href: "/blog" },
  },
};

interface ActionBoxProps {
  status: BeerStatus;
  asChild?: boolean;
}

export function ActionBox({ status, asChild = false }: ActionBoxProps) {
  const config = STATUS_STRATEGY_MAP[status] || STATUS_STRATEGY_MAP.ready;
  const Component = asChild ? Slot : config.component;

  const variantClasses = {
    primary: "bg-forest text-tan hover:bg-forest/90",
    secondary: "bg-tan text-forest hover:bg-tan/90",
    outline: "border border-forest text-forest hover:bg-forest/5",
  };

  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-serif text-base tracking-wide transition-all duration-300 shadow-sm font-semibold cursor-pointer";

  const IconComponent = config.icon;

  // Render using Slot composition if asChild is true, otherwise render full component
  if (asChild) {
    return <Component className={`${baseClasses} ${variantClasses[config.variant]}`} />;
  }

  const renderContent = () => (
    <>
      <IconComponent className="w-5 h-5" />
      {config.label}
    </>
  );

  const Comp = config.component as any;

  return (
    <Comp
      className={`${baseClasses} ${variantClasses[config.variant]}`}
      {...config.props}
    >
      {renderContent()}
    </Comp>
  );
}
