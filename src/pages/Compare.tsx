
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { ControlPanel } from '@/components/simulation/ControlPanel';
import { Badge } from '@/components/ui/badge';
import { addParityBit, checkParity, encodeHamming, decodeHamming, encodeCRC, checkCRC, generateRandomData } from '@/utils/errorCorrection';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type TestResult = {
  method: string;
  detected: number;
  corrected: number;
  undetected: number;
  color: string;
};

const ComparePage = () => {
  const [dataLength, setDataLength] = useState(4); // Start with 4 for Hamming compatibility
  const [errorRate, setErrorRate] = useState(0.1);
  const [iterations, setIterations] = useState(100);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const runSimulation = () => {
    setIsRunning(true);
    
    // Reset results
    const newResults: TestResult[] = [
      { method: 'Parity', detected: 0, corrected: 0, undetected: 0, color: '#4f46e5' },
      { method: 'Hamming', detected: 0, corrected: 0, undetected: 0, color: '#0ea5e9' },
      { method: 'CRC', detected: 0, corrected: 0, undetected: 0, color: '#10b981' }
    ];
    
    // Run the simulation for the specified number of iterations
    for (let i = 0; i < iterations; i++) {
      // Generate random data for this iteration
      const originalData = generateRandomData(dataLength);
      
      // Encode with each method
      const parityEncoded = addParityBit(originalData);
      
      // For Hamming, we need exactly 4 data bits
      let hammingData = originalData;
      if (originalData.length > 4) {
        hammingData = originalData.slice(0, 4);
      } else if (originalData.length < 4) {
        hammingData = originalData.padEnd(4, '0');
      }
      const hammingEncoded = encodeHamming(hammingData);
      
      const crcEncoded = encodeCRC(originalData);
      
      // Apply random errors based on error rate
      const parityWithErrors = applyRandomErrors(parityEncoded, errorRate);
      const hammingWithErrors = applyRandomErrors(hammingEncoded, errorRate);
      const crcWithErrors = applyRandomErrors(crcEncoded, errorRate);
      
      // Check if original data had errors after transmission
      const hasParityErrors = parityWithErrors.slice(0, originalData.length) !== originalData;
      const hasHammingErrors = hammingWithErrors.slice(2, 3) + hammingWithErrors.slice(4, 7) !== hammingData;
      const hasCrcErrors = crcWithErrors.slice(0, originalData.length) !== originalData;
      
      // Test Parity Check
      const parityResult = checkParity(parityWithErrors);
      if (!parityResult && hasParityErrors) {
        newResults[0].detected++; // Error correctly detected
      } else if (parityResult && hasParityErrors) {
        newResults[0].undetected++; // Error occurred but not detected
      }
      
      // Test Hamming Code
      const hammingResult = decodeHamming(hammingWithErrors);
      if (hammingResult.corrected && hammingResult.data === hammingData) {
        newResults[1].corrected++; // Error correctly corrected
      } else if (hammingResult.corrected && hammingResult.data !== hammingData) {
        newResults[1].detected++; // Error detected but incorrectly corrected
      } else if (hasHammingErrors) {
        newResults[1].undetected++; // Error occurred but not detected
      }
      
      // Test CRC
      const crcResult = checkCRC(crcWithErrors);
      if (!crcResult && hasCrcErrors) {
        newResults[2].detected++; // Error correctly detected
      } else if (crcResult && hasCrcErrors) {
        newResults[2].undetected++; // Error occurred but not detected
      }
    }
    
    setResults(newResults);
    setIsRunning(false);
  };
  
  // Helper function to apply random errors to data
  const applyRandomErrors = (data: string, errorRate: number): string => {
    const result = data.split('');
    for (let i = 0; i < result.length; i++) {
      if (Math.random() < errorRate) {
        result[i] = result[i] === '0' ? '1' : '0';
      }
    }
    return result.join('');
  };
  
  // Prepare data for chart
  const chartData = [
    {
      name: 'Detected Errors',
      Parity: results[0]?.detected || 0,
      Hamming: results[1]?.detected || 0,
      CRC: results[2]?.detected || 0
    },
    {
      name: 'Corrected Errors',
      Parity: results[0]?.corrected || 0,
      Hamming: results[1]?.corrected || 0,
      CRC: results[2]?.corrected || 0
    },
    {
      name: 'Undetected Errors',
      Parity: results[0]?.undetected || 0,
      Hamming: results[1]?.undetected || 0,
      CRC: results[2]?.undetected || 0
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">Comparison</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Error Correction Technique Comparison</h1>
            <p className="text-lg text-muted-foreground">
              Compare the performance of different error detection and correction techniques across multiple simulated transmissions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="glass-panel rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Performance Comparison</h2>
                
                {results.length > 0 ? (
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="Parity" fill="#4f46e5" />
                        <Bar dataKey="Hamming" fill="#0ea5e9" />
                        <Bar dataKey="CRC" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="w-full h-80 flex items-center justify-center">
                    <p className="text-muted-foreground">Run a simulation to see results</p>
                  </div>
                )}
                
                {results.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {results.map((result, index) => (
                        <div key={index} className="p-4 bg-secondary/30 rounded-lg">
                          <h4 className="font-medium text-center mb-2">{result.method}</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Detected:</span>
                              <span>{result.detected} ({Math.round(result.detected / iterations * 100)}%)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Corrected:</span>
                              <span>{result.corrected} ({Math.round(result.corrected / iterations * 100)}%)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Undetected:</span>
                              <span>{result.undetected} ({Math.round(result.undetected / iterations * 100)}%)</span>
                            </div>
                          </div>
                        </div>
                      ))}
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
                <h3 className="text-lg font-medium mb-3">Simulation Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="iterations" className="block text-sm font-medium mb-1">
                      Number of Iterations
                    </label>
                    <select
                      id="iterations"
                      value={iterations}
                      onChange={(e) => setIterations(Number(e.target.value))}
                      className="w-full p-2 bg-secondary/50 rounded-md text-sm"
                    >
                      <option value={10}>10 iterations</option>
                      <option value={100}>100 iterations</option>
                      <option value={500}>500 iterations</option>
                      <option value={1000}>1000 iterations</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">
                      More iterations provide more accurate results but take longer to simulate.
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={runSimulation}
                disabled={isRunning}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? "Running Simulation..." : "Run Simulation"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ComparePage;
