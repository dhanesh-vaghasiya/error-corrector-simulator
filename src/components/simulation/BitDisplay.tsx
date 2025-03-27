
import { cn } from '@/lib/utils';

type BitDisplayProps = {
  bits: string;
  errorBits?: number[];
  parityBits?: number[];
  highlightIndex?: number;
  className?: string;
};

export const BitDisplay = ({ 
  bits, 
  errorBits = [], 
  parityBits = [], 
  highlightIndex = -1,
  className = '' 
}: BitDisplayProps) => {
  return (
    <div className={cn("flex gap-1", className)}>
      {bits.split('').map((bit, index) => {
        let bitClass = bit === '0' ? 'bit-0' : 'bit-1';
        
        if (errorBits.includes(index)) {
          bitClass = 'bit-error';
        } else if (parityBits.includes(index)) {
          bitClass = 'bit-parity';
        }
        
        return (
          <div 
            key={index} 
            className={cn(
              'bit', 
              bitClass,
              highlightIndex === index && 'ring-2 ring-ring ring-offset-2'
            )}
          >
            {bit}
          </div>
        );
      })}
    </div>
  );
};
