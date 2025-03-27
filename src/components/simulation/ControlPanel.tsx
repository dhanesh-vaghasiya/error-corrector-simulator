
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

type ControlPanelProps = {
  errorRate: number;
  onErrorRateChange: (value: number) => void;
  dataLength: number;
  onDataLengthChange?: (value: number) => void;
  showDataLength?: boolean;
};

export const ControlPanel = ({
  errorRate,
  onErrorRateChange,
  dataLength,
  onDataLengthChange,
  showDataLength = true
}: ControlPanelProps) => {
  const formatPercent = (value: number) => `${Math.round(value * 100)}%`;
  
  return (
    <div className="glass-panel p-6 rounded-lg">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="error-rate">Error Rate</Label>
            <span className="text-sm font-medium">{formatPercent(errorRate)}</span>
          </div>
          <Slider
            id="error-rate"
            min={0}
            max={0.5}
            step={0.01}
            value={[errorRate]}
            onValueChange={(value) => onErrorRateChange(value[0])}
          />
          <p className="text-xs text-muted-foreground">The probability of each bit being flipped during transmission</p>
        </div>
        
        {showDataLength && onDataLengthChange && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="data-length">Data Length</Label>
              <span className="text-sm font-medium">{dataLength} bits</span>
            </div>
            <Slider
              id="data-length"
              min={4}
              max={16}
              step={1}
              value={[dataLength]}
              onValueChange={(value) => onDataLengthChange(value[0])}
            />
            <p className="text-xs text-muted-foreground">The length of the original data being transmitted</p>
          </div>
        )}
      </div>
    </div>
  );
};
