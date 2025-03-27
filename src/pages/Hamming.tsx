
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { BitDisplay } from '@/components/simulation/BitDisplay';
import { DataTransmission } from '@/components/simulation/DataTransmission';
import { ControlPanel } from '@/components/simulation/ControlPanel';
import { Badge } from '@/components/ui/badge';
import { encodeHamming, decodeHamming, generateRandomData } from '@/utils/errorCorrection';

const HammingPage = () => {
  const [errorRate, setErrorRate] = useState(0.1);
  const [originalData, setOriginalData] = useState('');
  const [encodedData, setEncodedData] = useState('');
  const [receivedData, setReceivedData] = useState('');
  const [decodedData, setDecodedData] = useState('');
  const [corrected, setCorrected] = useState(false);
  const [errorPosition, setErrorPosition] = useState(-1);
  const [errorIndices, setErrorIndices] = useState<number[]>([]);
  
  // Hamming(7,4) requires 4 data bits
  const dataLength = 4;
  const parityPositions = [0, 1, 3]; // Position of parity bits in Hamming(7,4)

  useEffect(() => {
    generateNewData();
  }, []);

  const generateNewData = () => {
    const newData = generateRandomData(dataLength);
    try {
      const encoded = encodeHamming(newData);
      
      setOriginalData(newData);
      setEncodedData(encoded);
      setReceivedData('');
      setDecodedData('');
      setCorrected(false);
      setErrorPosition(-1);
      setErrorIndices([]);
    } catch (error) {
      console.error('Error encoding data:', error);
    }
  };

  const handleTransmissionComplete = (data: string, errors: number[]) => {
    setReceivedData(data);
    setErrorIndices(errors);
    
    try {
      const result = decodeHamming(data);
      setDecodedData(result.data);
      setCorrected(result.corrected);
      setErrorPosition(result.errorPosition);
    } catch (error) {
      console.error('Error decoding data:', error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">Error Correction</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Hamming Code Simulation</h1>
            <p className="text-lg text-muted-foreground">
              Hamming codes can not only detect but also correct single-bit errors using strategically placed parity bits.
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
                  parityBits={parityPositions}
                  onTransmissionComplete={handleTransmissionComplete}
                />
                
                {receivedData && (
                  <div className="mt-8 p-4 rounded-lg bg-secondary/50">
                    <h3 className="text-lg font-medium mb-2">Results</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm mb-2">Decoded Data:</p>
                        <BitDisplay 
                          bits={decodedData} 
                          className="mb-4"
                          errorBits={decodedData !== originalData ? Array.from({ length: decodedData.length }).map((_, i) => decodedData[i] !== originalData[i] ? i : -1).filter(i => i !== -1) : []}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Error Correction:</span>
                        <Badge variant={corrected ? "success" : "outline"}>
                          {corrected ? "Error Corrected" : "No Correction Needed"}
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-sm mb-2">Error Position:</p>
                        {errorPosition >= 0 ? (
                          <Badge variant="outline">Bit {errorPosition}</Badge>
                        ) : (
                          <p className="text-sm text-muted-foreground">No error detected</p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm mb-2">Correction Success:</p>
                        <Badge variant={decodedData === originalData ? "success" : "destructive"}>
                          {decodedData === originalData ? "Successful" : "Failed"}
                        </Badge>
                        {decodedData !== originalData && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Hamming codes can only correct single bit errors. Multiple errors may lead to incorrect correction.
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
                showDataLength={false}
              />
              
              <div className="glass-panel p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3">How It Works</h3>
                <div className="space-y-4 text-sm">
                  <p>
                    <strong>1. Encoding:</strong> Insert parity bits at positions that are powers of 2 (1, 2, 4, 8...).
                  </p>
                  <p>
                    <strong>2. Transmission:</strong> Send the encoded data over a potentially noisy channel.
                  </p>
                  <p>
                    <strong>3. Detection & Correction:</strong> Calculate syndrome bits to locate and correct single-bit errors.
                  </p>
                  <p className="text-muted-foreground">
                    Note: This simulation uses Hamming(7,4) code - 4 data bits and 3 parity bits, allowing for single-bit error correction.
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

export default HammingPage;
