
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { BitDisplay } from '@/components/simulation/BitDisplay';
import { DataTransmission } from '@/components/simulation/DataTransmission';
import { ControlPanel } from '@/components/simulation/ControlPanel';
import { Badge } from '@/components/ui/badge';
import { addParityBit, checkParity, generateRandomData } from '@/utils/errorCorrection';

const ParityPage = () => {
  const [dataLength, setDataLength] = useState(8);
  const [errorRate, setErrorRate] = useState(0.1);
  const [originalData, setOriginalData] = useState('');
  const [encodedData, setEncodedData] = useState('');
  const [receivedData, setReceivedData] = useState('');
  const [errorDetected, setErrorDetected] = useState(false);
  const [errorIndices, setErrorIndices] = useState<number[]>([]);

  useEffect(() => {
    generateNewData();
  }, [dataLength]);

  const generateNewData = () => {
    const newData = generateRandomData(dataLength);
    const encoded = addParityBit(newData);
    
    setOriginalData(newData);
    setEncodedData(encoded);
    setReceivedData('');
    setErrorDetected(false);
    setErrorIndices([]);
  };

  const handleTransmissionComplete = (data: string, errors: number[]) => {
    setReceivedData(data);
    setErrorIndices(errors);
    setErrorDetected(!checkParity(data));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">Error Detection</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Parity Check Simulation</h1>
            <p className="text-lg text-muted-foreground">
              Parity checking is one of the simplest forms of error detection, adding a single bit to ensure the total count of 1s is even (or odd).
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="glass-panel rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Transmission Simulation</h2>
                
                <DataTransmission
                  originalData={originalData}
                  encodedData={encodedData}
                  errorRate={errorRate}
                  parityBits={[originalData.length]}
                  onTransmissionComplete={handleTransmissionComplete}
                />
                
                {receivedData && (
                  <div className="mt-8 p-4 rounded-lg bg-secondary/50">
                    <h3 className="text-lg font-medium mb-2">Results</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Error Detection:</span>
                        <Badge variant={errorDetected ? "destructive" : "outline"}>
                          {errorDetected ? "Error Detected" : "No Errors Detected"}
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-sm mb-2">Actual Errors:</p>
                        {errorIndices.length > 0 ? (
                          <div className="text-sm text-muted-foreground">
                            {errorIndices.map(index => (
                              <Badge key={index} variant="outline" className="mr-1">
                                Bit {index}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No errors occurred</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <ControlPanel
                errorRate={errorRate}
                onErrorRateChange={setErrorRate}
                dataLength={dataLength}
                onDataLengthChange={setDataLength}
              />
              
              <div className="glass-panel p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3">How It Works</h3>
                <div className="space-y-4 text-sm">
                  <p>
                    <strong>1. Encoding:</strong> Count the number of 1s in the data and add a parity bit (0 or 1) to make the total count even.
                  </p>
                  <p>
                    <strong>2. Transmission:</strong> Send the data with the parity bit over a potentially noisy channel.
                  </p>
                  <p>
                    <strong>3. Detection:</strong> At the receiver, count the 1s again. If the count is not even, an error has occurred.
                  </p>
                  <p className="text-muted-foreground">
                    Note: Parity checks can only detect odd numbers of bit errors. If two bits are flipped, the error will go undetected.
                  </p>
                </div>
              </div>
              
              <button
                onClick={generateNewData}
                className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Generate New Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ParityPage;
