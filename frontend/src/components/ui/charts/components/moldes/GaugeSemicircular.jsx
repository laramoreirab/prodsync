"use client";

import { useState } from "react";

import {
    RadialBar,
    RadialBarChart,
  } from "recharts";
  
  import {
    ChartContainer,
  } from "@/components/ui/chart";

// ============================================================
// RADIAL BAR (Gauge semicircular)
// ============================================================

  export function Ex1B_GaugeSemicircular({
    valor,
    label
  }) {

    const data = [{ value: valor }];
  
    return (
      <div className="flex flex-col items-center">
        <ChartContainer config={gaugeConfig} className="h-[120px] w-[120px]">
          <RadialBarChart
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius={40}
            outerRadius={60}
            barSize={16}
          >
            <RadialBar dataKey="value" background={false} cornerRadius={4} />
          </RadialBarChart>
        </ChartContainer>
  
        <span className="text-2xl font-bold -mt-6">{valor}%</span>
        <span className="text-xs text-muted-foreground mt-1">{label}</span>
      </div>
    );
  }