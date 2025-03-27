
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { BitDisplay } from '@/components/simulation/BitDisplay';
import { DataTransmission } from '@/components/simulation/DataTransmission';
import { ControlPanel } from '@/components/simulation/ControlPanel';
import { Badge } from '@/components/ui/badge';
import { encodeCRC, checkCRC, generateRandomData } from '@/utils/errorCorrection';

const CRCPage = () => {
  const [dataLength, setDataLength] = useState(8);
  const [errorRate, setErrorRate] = useState(0.1);
  const [originalData, setOriginalData] = useState('');
  const [encodedData, setEncodedData] = useState('');
  const [receivedData, setReceivedData] = useState('');
  const [errorDetected, setErrorDetected] = useState(false);
  const [errorIndices, setErrorIndices] = useState<number[]>([]);
  const polynomial = '1011'; // CRC-3
  
  useEffect(() => {
    generateNewData();
  }, [dataLength]);

  const generateNewData = () => {
    const newData = generateRandomData(dataLength);
    const encoded = encodeCRC(newData, polynomial);
    
    setOriginalData(newData);
    setEncodedData(encoded);
    setReceivedData('');
    setErrorDetected(false);
    setErrorIndices([]);
  };

  const handleTransmissionComplete = (data: string, errors: number[]) => {
    setReceivedData(data);
    setErrorIndices(errors);
    
    // Check if CRC detects any errors
    setErrorDetected(!checkCRC(data, polynomial));
  };

  // Calculate where the CRC bits start
  const crcStartIndex = originalData.length;
  const crcBits = encodedData.length > crcStartIndex 
    ? Array.from({ length: encodedData.length - crcStartIndex }, (_, i) => crcStartIndex + i)
    : [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">Error Detection</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Cyclic Redundancy Check Simulation</h1>
            <p className="text-lg text-muted-foreground">
              CRC is a powerful error detection technique that treats data as polynomials and uses polynomial division for detecting errors.
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
                  parityBits={crcBits}
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
                      
                      <div>
                        <p className="text-sm mb-2">Detection Success:</p>
                        <Badge variant={
                          (errorIndices.length > 0 && errorDetected) || 
                          (errorIndices.length === 0 && !errorDetected)
                            ? "success" 
                            : "destructive"
                        }>
                          {(errorIndices.length > 0 && errorDetected) || 
                           (errorIndices.length === 0 && !errorDetected)
                            ? "Successful" 
                            : "Failed"}
                        </Badge>
                        {errorIndices.length > 0 && !errorDetected && (
                          <p className="text-xs text-muted-foreground mt-1">
                            CRC failed to detect the error pattern. This is rare but possible with certain error combinations.
                          </p>
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
                    <strong>1. Encoding:</strong> Perform polynomial division of data by generator polynomial and append remainder as CRC bits.
                  </p>
                  <p>
                    <strong>2. Transmission:</strong> Send the data with CRC bits over a potentially noisy channel.
                  </p>
                  <p>
                    <strong>3. Detection:</strong> Receiver divides received data by the same polynomial. If remainder is non-zero, errors occurred.
                  </p>
                  <p className="text-muted-foreground">
                    Note: This simulation uses polynomial {polynomial} (CRC-3). CRC is highly effective at detecting burst errors and is used in Ethernet, USB, and many other protocols.
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

export default CRCPage;
