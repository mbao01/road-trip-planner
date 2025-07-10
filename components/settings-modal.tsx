"use client";

import type { Settings } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { DISTANCE_UNITS } from "@/helpers/constants/distance";
import { Currency, DistanceUnit, MapStyle } from "@prisma/client";
import { InfoIcon } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripName: string;
  settings: Settings;
  onUpdateSettings: (
    newSettings: Omit<Settings, "id" | "tripId" | "createdAt" | "updatedAt">
  ) => void;
}

export function SettingsModal({
  open,
  onOpenChange,
  tripName,
  settings,
  onUpdateSettings,
}: SettingsModalProps) {
  const [mapStyle, setMapStyle] = useState(settings.mapStyle);
  const [currency, setCurrency] = useState(settings.currency);
  const [fuelCost, setFuelCost] = useState(String(settings.fuelCostPerLitre));
  const [mpg, setMpg] = useState(String(settings.mpg));
  const [calculateCosts, setCalculateCosts] = useState(settings.calculateCosts);
  const [avoidTolls, setAvoidTolls] = useState(settings.avoidTolls);
  const [avoidMotorways, setAvoidMotorways] = useState(settings.avoidMotorways);
  const [distanceUnit, setDistanceUnit] = useState(settings.distanceUnit);

  // Reset state if settings prop changes (e.g., after a save and re-fetch)
  useEffect(() => {
    setMapStyle(settings.mapStyle);
    setCurrency(settings.currency);
    setFuelCost(String(settings.fuelCostPerLitre));
    setMpg(String(settings.mpg));
    setCalculateCosts(settings.calculateCosts);
    setAvoidTolls(settings.avoidTolls);
    setAvoidMotorways(settings.avoidMotorways);
    setDistanceUnit(settings.distanceUnit);
  }, [settings]);

  const handleUpdate = () => {
    onUpdateSettings({
      mapStyle,
      currency,
      fuelCostPerLitre: Number.parseFloat(fuelCost),
      mpg: Number.parseInt(mpg, 10),
      calculateCosts,
      avoidTolls,
      avoidMotorways,
      distanceUnit,
    });
    onOpenChange(false); // Close modal on update
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update trip settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <InfoIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-700">These settings only apply to '{tripName}'.</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Map style</Label>
            <RadioGroup
              value={mapStyle}
              onValueChange={(v) => setMapStyle(v as any)}
              className="flex gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={MapStyle.DEFAULT} id="default" />
                <Label htmlFor="default" className="text-sm">
                  Default
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={MapStyle.ROADMAP} id="roadmap" />
                <Label htmlFor="roadmap" className="text-sm">
                  Roadmap
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={MapStyle.SATELLITE} id="satellite" />
                <Label htmlFor="satellite" className="text-sm">
                  Satellite
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Distance unit</Label>
            <RadioGroup
              value={distanceUnit}
              onValueChange={(v) => setDistanceUnit(v as any)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={DistanceUnit.MI} id="mi" />
                <Label htmlFor="mi" className="text-sm">
                  Miles ({DISTANCE_UNITS[DistanceUnit.MI]})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={DistanceUnit.KM} id="km" />
                <Label htmlFor="km" className="text-sm">
                  Kilometers ({DISTANCE_UNITS[DistanceUnit.KM]})
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="calculate-costs" className="text-sm font-medium">
              Calculate trip costs
            </Label>
            <Switch
              id="calculate-costs"
              checked={Boolean(calculateCosts)}
              onCheckedChange={setCalculateCosts}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Currency</Label>
            <RadioGroup
              value={currency}
              onValueChange={(v) => setCurrency(v as any)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Currency.GBP} id="gbp" />
                <Label htmlFor="gbp" className="text-sm">
                  £ GBP
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Currency.EUR} id="eur" />
                <Label htmlFor="eur" className="text-sm">
                  € EUR
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Currency.USD} id="usd" />
                <Label htmlFor="usd" className="text-sm">
                  $ USD
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuel-cost" className="text-sm font-medium">
              Fuel cost per litre
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm">£</span>
              <Input
                id="fuel-cost"
                value={fuelCost}
                onChange={(e) => setFuelCost(e.target.value)}
                className="w-20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mpg" className="text-sm font-medium">
              Miles per gallon (average)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="mpg"
                value={mpg}
                onChange={(e) => setMpg(e.target.value)}
                className="w-20"
              />
              <span className="text-sm">mpg</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="avoid-tolls" className="text-sm font-medium">
              Avoid tolls
            </Label>
            <Switch
              id="avoid-tolls"
              checked={Boolean(avoidTolls)}
              onCheckedChange={setAvoidTolls}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="avoid-motorways" className="text-sm font-medium">
              Avoid motorways
            </Label>
            <Switch
              id="avoid-motorways"
              checked={Boolean(avoidMotorways)}
              onCheckedChange={setAvoidMotorways}
            />
          </div>

          <Button onClick={handleUpdate} className="w-full bg-orange-500 hover:bg-orange-600">
            Update trip settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
