
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <Layout>
      <section className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">Error Correction Simulation</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Visualize Data Communication <span className="text-primary">Error Correction</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              An interactive simulator for exploring how error detection and correction techniques protect data during transmission.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/parity" className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-medium">
                Start Exploring
              </Link>
              <a href="#techniques" className="px-6 py-3 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors font-medium">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">What You'll Learn</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Visualize Error Correction In Action
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                This simulator helps you understand the mechanics behind data integrity techniques used in all modern digital systems.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                title="Interactive Simulations"
                description="Configure error rates and data patterns to see how different algorithms perform under various conditions."
                iconColor="bg-blue-500/10 text-blue-500"
                index={0}
              />
              <FeatureCard
                title="Visual Learning"
                description="Watch data transmission in real-time with clear visualization of error detection and correction."
                iconColor="bg-purple-500/10 text-purple-500"
                index={1}
              />
              <FeatureCard
                title="Compare Methods"
                description="Directly compare different error correction techniques to understand their strengths and weaknesses."
                iconColor="bg-green-500/10 text-green-500"
                index={2}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="techniques" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Error Correction Techniques</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Explore Key Methods
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Try out these fundamental algorithms that are the building blocks of reliable digital communication.
              </p>
            </div>

            <div className="space-y-8">
              <TechniqueCard
                title="Parity Check"
                description="The simplest form of error detection using a single additional bit to ensure the total number of 1s is even or odd."
                linkTo="/parity"
                index={0}
              />
              <TechniqueCard
                title="Hamming Code"
                description="A powerful method that can not only detect but also correct single-bit errors using strategically placed parity bits."
                linkTo="/hamming"
                index={1}
              />
              <TechniqueCard
                title="Cyclic Redundancy Check (CRC)"
                description="Advanced error detection using polynomial division, capable of detecting burst errors in transmission."
                linkTo="/crc"
                index={2}
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

const FeatureCard = ({ title, description, iconColor, index }: { 
  title: string; 
  description: string; 
  iconColor: string;
  index: number;
}) => {
  return (
    <motion.div 
      className="glass-panel p-6 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
    >
      <div className={`w-12 h-12 ${iconColor} rounded-full flex items-center justify-center mb-4`}>
        <div className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

const TechniqueCard = ({ title, description, linkTo, index }: { 
  title: string; 
  description: string; 
  linkTo: string;
  index: number;
}) => {
  return (
    <motion.div 
      className="glass-panel p-6 rounded-lg"
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          <Link 
            to={linkTo}
            className="text-primary hover:underline inline-flex items-center"
          >
            Try Simulation
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Index;
