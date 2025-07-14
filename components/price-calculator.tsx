"use client";

import { Badge } from "@/components/ui/badge";

interface FileConfig {
  coloured: boolean;
  duplex: boolean;
  spiral: boolean;
  hardbind: boolean;
  quantity: number;
}

interface PrintingRates {
  colorRate: number;
  bwRate: number;
  duplexExtra: number;
  hardbindRate: number;
  spiralRate: number;
}

interface PriceCalculatorProps {
  config: FileConfig;
  rates: PrintingRates | null;
  price: number;
}

export function PriceCalculator({
  config,
  rates,
  price,
}: PriceCalculatorProps) {
  const defaultRates = {
    colorRate: 10,
    bwRate: 2,
    duplexExtra: 1,
    hardbindRate: 40,
    spiralRate: 20,
  };

  const activeRates = rates || defaultRates;

  const breakdown = [];

  if (config.coloured) {
    breakdown.push(`Color: ₹${activeRates.colorRate}`);
  } else {
    breakdown.push(`B&W: ₹${activeRates.bwRate}`);
  }

  if (config.duplex) {
    breakdown.push(`Duplex: +₹${activeRates.duplexExtra}`);
  }

  if (config.spiral) {
    breakdown.push(`Spiral: +₹${activeRates.spiralRate}`);
  }

  if (config.hardbind) {
    breakdown.push(`Hard Bind: +₹${activeRates.hardbindRate}`);
  }

  if (config.quantity > 1) {
    breakdown.push(`Qty: ${config.quantity}`);
  }

  return (
    <div className="text-right">
      <div className="text-2xl font-bold text-green-600">₹{price}</div>
      <div className="text-xs text-gray-500 max-w-32">
        {breakdown.join(" • ")}
        {!rates && (
          <Badge
            variant="outline"
            className="ml-1 text-xs border-orange-300 text-orange-600"
          >
            Default
          </Badge>
        )}
      </div>
    </div>
  );
}
