
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll listener
  useState(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all-ease ${isScrolled ? 'glass-panel py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xl font-medium">
            DataCorrSim
          </Link>
          <Badge variant="outline" className="text-xs font-normal">Beta</Badge>
        </div>
        <nav className="hidden md:flex items-center space-x-10">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/parity" className="text-sm font-medium hover:text-primary transition-colors">Parity Check</Link>
          <Link to="/hamming" className="text-sm font-medium hover:text-primary transition-colors">Hamming Code</Link>
          <Link to="/crc" className="text-sm font-medium hover:text-primary transition-colors">CRC</Link>
          <Link to="/compare" className="text-sm font-medium hover:text-primary transition-colors">Compare</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
