
// Generate random binary data
export const generateRandomData = (length: number): string => {
  return Array.from({ length }, () => Math.round(Math.random()).toString()).join('');
};

// Parity Check functions
export const addParityBit = (data: string): string => {
  // Calculate even parity
  const numOnes = data.split('').filter(bit => bit === '1').length;
  const parityBit = numOnes % 2 === 0 ? '0' : '1';
  return data + parityBit;
};

export const checkParity = (data: string): boolean => {
  // Check if even parity is maintained
  const numOnes = data.split('').filter(bit => bit === '1').length;
  return numOnes % 2 === 0;
};

// Hamming Code functions (simplified for demonstration)
export const encodeHamming = (data: string): string => {
  // For simplicity, we'll implement a basic Hamming(7,4) code
  // In a real implementation, this would be more dynamic
  
  if (data.length !== 4) {
    throw new Error('Hamming(7,4) requires exactly 4 data bits');
  }
  
  const d1 = parseInt(data[0], 2);
  const d2 = parseInt(data[1], 2);
  const d3 = parseInt(data[2], 2);
  const d4 = parseInt(data[3], 2);
  
  // Calculate parity bits
  const p1 = (d1 + d2 + d4) % 2;
  const p2 = (d1 + d3 + d4) % 2;
  const p3 = (d2 + d3 + d4) % 2;
  
  // Combine data and parity bits in Hamming code format
  // Format: p1, p2, d1, p3, d2, d3, d4
  return [p1, p2, d1, p3, d2, d3, d4].map(String).join('');
};

export const decodeHamming = (encoded: string): { data: string, corrected: boolean, errorPosition: number } => {
  if (encoded.length !== 7) {
    throw new Error('Hamming(7,4) requires exactly 7 bits');
  }
  
  const bits = encoded.split('').map(bit => parseInt(bit, 2));
  
  // Extract bits
  const p1 = bits[0];
  const p2 = bits[1];
  const d1 = bits[2];
  const p3 = bits[3];
  const d2 = bits[4];
  const d3 = bits[5];
  const d4 = bits[6];
  
  // Calculate syndrome
  const s1 = (p1 + d1 + d2 + d4) % 2;
  const s2 = (p2 + d1 + d3 + d4) % 2;
  const s3 = (p3 + d2 + d3 + d4) % 2;
  
  const syndrome = s1 * 1 + s2 * 2 + s3 * 4;
  
  // Create corrected array (copy of original)
  const corrected = [...bits];
  let errorPosition = -1;
  
  // If syndrome is non-zero, correct the error
  if (syndrome !== 0) {
    // The syndrome indicates the position to flip (1-indexed)
    errorPosition = syndrome - 1;
    if (errorPosition >= 0 && errorPosition < 7) {
      corrected[errorPosition] = corrected[errorPosition] === 0 ? 1 : 0;
    }
  }
  
  // Extract data bits (positions 2, 4, 5, 6 in 0-indexed array)
  const correctedData = [corrected[2], corrected[4], corrected[5], corrected[6]].join('');
  
  return {
    data: correctedData,
    corrected: syndrome !== 0,
    errorPosition
  };
};

// CRC functions
export const calculateCRC = (data: string, polynomial: string = '1011'): string => {
  // Convert strings to arrays for easier manipulation
  const dataArr = data.split('').map(bit => parseInt(bit, 2));
  const polyArr = polynomial.split('').map(bit => parseInt(bit, 2));
  
  // Append zeros to data (equal to polynomial length - 1)
  const crcLength = polyArr.length - 1;
  const paddedData = [...dataArr, ...Array(crcLength).fill(0)];
  
  // Perform division
  for (let i = 0; i < dataArr.length; i++) {
    if (paddedData[i] === 0) continue;
    
    for (let j = 0; j < polyArr.length; j++) {
      paddedData[i + j] = (paddedData[i + j] ^ polyArr[j]) % 2;
    }
  }
  
  // Return the remainder (last crcLength bits)
  return paddedData.slice(-crcLength).join('');
};

export const encodeCRC = (data: string, polynomial: string = '1011'): string => {
  const crc = calculateCRC(data, polynomial);
  return data + crc;
};

export const checkCRC = (encoded: string, polynomial: string = '1011'): boolean => {
  // Calculate CRC on the entire message
  // If remainder is 0, then no errors detected
  const remainder = calculateCRC(encoded, polynomial);
  return remainder.split('').every(bit => bit === '0');
};
