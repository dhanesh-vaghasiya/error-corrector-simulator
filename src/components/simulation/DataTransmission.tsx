
import { useState, useEffect } from 'react';
import { BitDisplay } from './BitDisplay';

type DataTransmissionProps = {
  originalData: string;
  encodedData: string;
  errorRate: number;
  errorBits?: number[];
  parityBits?: number[];
  onTransmissionComplete: (receivedData: string, errorIndices: number[]) => void;
};

export const DataTransmission = ({
  originalData,
  encodedData,
  errorRate,
  errorBits = [],
  parityBits = [],
  onTransmissionComplete
}: DataTransmissionProps) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'complete'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [receivedData, setReceivedData] = useState(encodedData);
  const [transmissionErrors, setTransmissionErrors] = useState<number[]>([]);

  useEffect(() => {
    if (status === 'idle') {
      return;
    }

    if (currentStep === 0) {
      // Start animation
      const timer = setTimeout(() => {
        setCurrentStep(1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (currentStep === 1) {
      // Simulate transmission and errors
      const newData = encodedData.split('');
      const newErrors: number[] = [];
      
      for (let i = 0; i < newData.length; i++) {
        if (Math.random() < errorRate && !parityBits.includes(i)) {
          newData[i] = newData[i] === '0' ? '1' : '0';
          newErrors.push(i);
        }
      }
      
      const timer = setTimeout(() => {
        setReceivedData(newData.join(''));
        setTransmissionErrors(newErrors);
        setCurrentStep(2);
      }, 1500);
      
      return () => clearTimeout(timer);
    }

    if (currentStep === 2) {
      // Complete transmission
      const timer = setTimeout(() => {
        onTransmissionComplete(receivedData, transmissionErrors);
        setStatus('complete');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [status, currentStep, encodedData, errorRate, parityBits, onTransmissionComplete, receivedData, transmissionErrors]);

  const startTransmission = () => {
    setStatus('sending');
    setCurrentStep(0);
    setTransmissionErrors([]);
    setReceivedData(encodedData);
  };

  return (
    <div className="space-y-8 my-8">
      <div className="flex flex-col items-center gap-12">
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-medium">Sender</h3>
          <BitDisplay bits={originalData} className="mb-2" />
          <BitDisplay bits={encodedData} parityBits={parityBits} />
        </div>
        
        <div className="w-full max-w-md h-16 relative">
          {status === 'sending' && (
            <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2">
              <div className="h-0.5 bg-muted-foreground/20 w-full"></div>
              <div className={`h-1.5 w-12 rounded-full bg-primary absolute left-0 top-1/2 transform -translate-y-1/2 ${
                currentStep >= 1 ? 'animate-flow-right' : ''
              }`}></div>
            </div>
          )}
          {status === 'complete' && transmissionErrors.length > 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-3 py-1 bg-destructive/10 text-destructive text-sm rounded-full">
                {transmissionErrors.length} error{transmissionErrors.length > 1 ? 's' : ''} detected
              </div>
            </div>
          ) : null}
        </div>
        
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-medium">Receiver</h3>
          <BitDisplay 
            bits={receivedData} 
            errorBits={status === 'complete' ? transmissionErrors : []}
            parityBits={parityBits}
          />
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={startTransmission}
          disabled={status === 'sending'}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'idle' ? 'Start Transmission' : 
           status === 'sending' ? 'Transmitting...' : 
           'Transmit Again'}
        </button>
      </div>
    </div>
  );
};
